function CPoint3(dX, dY, dZ) {
    this.X = dX;
    this.Y = dY;
    this.Z = dZ;
    return this;
}

CPoint3.prototype.toString = function () {
    return "(" + this.X + "," + this.Y + "," + this.Z + ")";
}
CPoint3.prototype.Distance = function () {
    return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
}

function GeographicTransform(dx, dy, dz, rx, ry, rz, sf) {

    function RotX(vect, r) {
        var sx = Math.sin(r);
        var cx = Math.cos(r);
        return new CPoint3(
			vect.X,
			cx * vect.Y + sx * vect.Z,
			-sx * vect.Y + cx * vect.Z);
    }
    function RotY(vect, r) {
        var sy = Math.sin(r);
        var cy = Math.cos(r);
        return new CPoint3(
			cy * vect.X - sy * vect.Z,
			vect.Y,
			sy * vect.X + cy * vect.Z);
    }
    function RotZ(vect, r) {
        var sz = Math.sin(r);
        var cz = Math.cos(r);
        return new CPoint3(
			cz * vect.X + sz * vect.Y,
			-sz * vect.X + cz * vect.Y,
			vect.Z);
    }
    this.BursaWolfTransform = function (vect) {
        return new CPoint3(
			dx + (1 + sf) * (vect.X + rz * vect.Y - ry * vect.Z),
			dy + (1 + sf) * (-rz * vect.X + vect.Y + rx * vect.Z),
			dz + (1 + sf) * (ry * vect.X - rx * vect.Y + vect.Z));
    }
    this.MolodenskyBadekasTransform = function (vect) {
        return new CPoint3(
			dx + sf * vect.X + (vect.X + rz * vect.Y - ry * vect.Z),
			dy + sf * vect.Y + (-rz * vect.X + vect.Y + rx * vect.Z),
			dz + sf * vect.Z + (ry * vect.X - rx * vect.Y + vect.Z));
    }
    return this;
}

function HorizontalDatum(SemiMajorAxis, Flattening) {
    this.SemiMajorAxis = SemiMajorAxis;
    this.Flattening = Flattening;

    this.SemiMinorAxis = this.SemiMajorAxis * (1 - this.Flattening);
    this.es = 1 - (1 - this.Flattening) * (1 - this.Flattening);
    this.et2 = this.es / (1 - this.es);
    return this;
}

HorizontalDatum.prototype.CartesianFromGeodetic = function (locat) {
    if (locat.Y == 90 || locat.Y == -90)
        return new CPoint3(0, 0, ((locat.Y == -90) ? -1 : 1) * this.SemiMajorAxis * (1 - this.es) + locat.Z);

    var lat = locat.Y * Math.PI / 180.0;
    var lon = locat.X * Math.PI / 180.0;

    var Sin_Lat = Math.sin(lat);
    var Cos_Lat = Math.cos(lat);
    var N = this.SemiMajorAxis / Math.sqrt(1 - this.es * Sin_Lat * Sin_Lat);
    var dX = (N + locat.Z) * Cos_Lat * Math.cos(lon);
    var dY = (N + locat.Z) * Cos_Lat * Math.sin(lon);
    var dZ = ((1 - this.es) * N + locat.Z) * Sin_Lat;
    return new CPoint3(dX, dY, dZ);
}

HorizontalDatum.prototype.GeodeticFromCartesian = function (locat) {
    if (locat.X == 0.0 && locat.Y == 0.0)
        return new CPoint3(0.0, (locat.Z >= 0.0) ? 90 : -90, Math.abs(locat.Z) - this.SemiMinorAxis);

    var AD_C = 1.0026000;
    var COS_67P5 = 0.38268343236508977;

    var W2 = locat.X * locat.X + locat.Y * locat.Y;
    var W = Math.sqrt(W2);
    var T0 = locat.Z * AD_C;
    var S0 = Math.sqrt(T0 * T0 + W2);
    var Sin_B0 = T0 / S0;
    var Cos_B0 = W / S0;
    var Sin3_B0 = Sin_B0 * Sin_B0 * Sin_B0;
    var T1 = locat.Z + this.SemiMinorAxis * this.et2 * Sin3_B0;
    var Sum = W - this.SemiMajorAxis * this.es * Cos_B0 * Cos_B0 * Cos_B0;
    var S1 = Math.sqrt(T1 * T1 + Sum * Sum);
    var Sin_p1 = T1 / S1;
    var Cos_p1 = Sum / S1;
    var Rn = this.SemiMajorAxis / Math.sqrt(1.0 - this.es * Sin_p1 * Sin_p1);

    var dZ = 0;
    if (Cos_p1 >= COS_67P5)
        dZ = W / Cos_p1 - Rn;
    else if (Cos_p1 <= -COS_67P5)
        dZ = W / -Cos_p1 - Rn;
    else
        dZ = locat.Z / Sin_p1 - Rn * (1.0 - this.es);

    var dY = Math.atan(Sin_p1 / Cos_p1) * 180 / Math.PI;
    var dX = ((locat.X != 0.0) ? Math.atan2(locat.Y, locat.X) * 180 / Math.PI : ((locat.Y > 0) ? 90 : -90));
    return new CPoint3(dX, dY, dZ);
}

function TransverseMercatorProjection(centralMeridian, falseEasting, falseNorthing, latitudeOfOrigin, scaleFactor) {
    this.centralMeridian = centralMeridian;
    this.falseEasting = falseEasting;
    this.falseNorthing = falseNorthing;
    this.latitudeOfOrigin = latitudeOfOrigin;
    this.scaleFactor = scaleFactor;

    this.Forward = function (ellip, pnt) {
        pnt = EllipseForward(ellip, CPoint3((pnt.X - centralMeridian) * Math.PI / 180, pnt.Y * Math.PI / 180, pnt.Z));
        pnt.X = pnt.X * scaleFactor * ellip.SemiMajorAxis + falseEasting;
        pnt.Y = pnt.Y * scaleFactor * ellip.SemiMajorAxis + falseNorthing;
        return pnt;
    }
    this.Inverse = function (ellip, pnt) {
        pnt = EllipseInverse(ellip, CPoint3((pnt.X - falseEasting) / ellip.SemiMajorAxis / scaleFactor, (pnt.Y - falseNorthing) / ellip.SemiMajorAxis / scaleFactor, pnt.Z));
        pnt.X = pnt.X * 180 / Math.PI + centralMeridian;
        pnt.Y = pnt.Y * 180 / Math.PI;
        return pnt;
    }

    function pj_mlfn(phi, sphi, cphi, es) {
        var tt;
        var en0 = 1 - es * (.25 + es * (.046875 + es * (.01953125 + es * .01068115234375)));
        var en1 = es * (.75 - es * (.046875 + es * (.01953125 + es * .01068115234375)));
        var en2 = (tt = es * es) * (.46875 - es * (.01302083333333333333 + es * .00712076822916666666));
        var en3 = (tt *= es) * (.36458333333333333333 - es * .00569661458333333333);
        var en4 = tt * es * .3076171875;

        cphi *= sphi;
        sphi *= sphi;
        return (en0 * phi - cphi * (en1 + sphi * (en2 + sphi * (en3 + sphi * en4))));
    }

    function pj_inv_mlfn(arg, es) {
        var k = 1. / (1. - es);
        var phi = arg;

        var i;
        for (i = 10; i ; --i) { /* rarely goes over 2 iterations */
            var s = Math.sin(phi);
            var t = 1. - es * s * s;
            phi -= t = (pj_mlfn(phi, s, Math.cos(phi), es) - arg) * (t * Math.sqrt(t)) * k;
            if (Math.abs(t) < 1e-11)
                return phi;
        }
        return phi;
    }

    function EllipseForward(ellip, pnt) {
        var sinphi = Math.sin(pnt.Y);
        var cosphi = Math.cos(pnt.Y);
        var t = Math.abs(cosphi) > 1e-10 ? sinphi / cosphi : 0.;
        t *= t;
        var al = cosphi * pnt.X;
        var als = al * al;
        al /= Math.sqrt(1. - ellip.es * sinphi * sinphi);
        var n = ellip.et2 * cosphi * cosphi;
        var tmx = al * (1 +
			als / 6 * (1. - t + n +
			als / 20 * (5. + t * (t - 18.) + n * (14. - 58. * t)
			+ als / 42 * (61. + t * (t * (179. - t) - 479.))
			)));

        var lat0 = latitudeOfOrigin * Math.PI / 180;
        var ml0 = pj_mlfn(lat0, Math.sin(lat0), Math.cos(lat0), ellip.es);

        var tmy = pj_mlfn(pnt.Y, sinphi, cosphi, ellip.es) - ml0 +
			sinphi * al * pnt.X / 2 * (1. +
			als / 12 * (5. - t + n * (9. + 4. * n) +
			als / 30 * (61. + t * (t - 58.) + n * (270. - 330 * t)
			+ als / 56 * (1385. + t * (t * (543. - t) - 3111.))
			)));

        return new CPoint3(tmx, tmy, pnt.Z);
    }

    function EllipseInverse(ellip, pnt) {
        var lat0 = latitudeOfOrigin * Math.PI / 180;
        var ml0 = pj_mlfn(lat0, Math.sin(lat0), Math.cos(lat0), ellip.es);
        var lat = pj_inv_mlfn(ml0 + pnt.Y, ellip.es);

        var HALFPI = Math.PI / 2;
        if (Math.abs(lat) >= HALFPI)
            return new CPoint3(0, (pnt.Y < 0. ? -HALFPI : HALFPI), pnt.Z);

        var sinphi = Math.sin(lat);
        var cosphi = Math.cos(lat);
        var t = Math.abs(cosphi) > 1e-10 ? sinphi / cosphi : 0.;
        var n = ellip.et2 * cosphi * cosphi;
        var con = 1. - ellip.es * sinphi * sinphi
        var d = pnt.X * Math.sqrt(con);
        con *= t;
        t *= t;
        var ds = d * d;
        lat -= (con * ds / (1. - ellip.es)) / 2 * (1. -
			ds / 12 * (5. + t * (3. - 9. * n) + n * (1. - 4 * n) -
			ds / 30 * (61. + t * (90. - 252. * n +
				45. * t) + 46. * n
		   - ds / 56 * (1385. + t * (3633. + t * (4095. + 1574. * t)))
			)));
        var lon = d * (1 -
			ds / 6 * (1. + 2. * t + n -
			ds / 20 * (5. + t * (28. + 24. * t + 8. * n) + 6. * n
		   - ds / 42 * (61. + t * (662. + t * (1320. + 720. * t)))
			))) / cosphi;

        return new CPoint3(lon, lat, pnt.Z);
    }
    return this;
}

function CoordinateTransform(sourceCoord, sourceProj, destCoord, destProj, gTrans, locate) {
    var srcLocat = locate;
    if (sourceProj)
        srcLocat = sourceProj.Inverse(sourceCoord, srcLocat);
    if (sourceCoord)
        srcLocat = sourceCoord.CartesianFromGeodetic(srcLocat);
    if (gTrans)
        srcLocat = gTrans.BursaWolfTransform(srcLocat);
    if (destCoord)
        srcLocat = destCoord.GeodeticFromCartesian(srcLocat);
    if (destProj)
        srcLocat = destProj.Forward(destCoord, srcLocat);
    return srcLocat;
}