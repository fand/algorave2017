vec2 rotate(in vec2 p, in float t) {
    return mat2(
        sin(t), -cos(t),
        cos(t), -sin(-t)
    ) * p;
}

#pragma glslify: export(rotate)
