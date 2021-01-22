export class Convert {
    static rad2deg(rad: number) {
        return rad * 180 / Math.PI;
    }

    static deg2rad(deg: number) {
        return deg * Math.PI / 180;
    }

    static between(value: number, min: number, max: number) {
        return Math.min(max, Math.max(min, value));
    }
}