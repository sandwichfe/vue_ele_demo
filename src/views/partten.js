export var realPath = "D:";

export function change(p) {
    if (p==true) {
        realPath = "D:";
    } else if (p==false) {
        realPath = "E:";
    }
}



