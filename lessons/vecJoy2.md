この講義では、ベクトル型と四則演算について学びます。  

---

まず最初に、四則演算とは関係ありませんが、  
**`v = vec3( 0.0 )`** とすると、**すべての要素が `0.0` の `vec3`** を作ることができます。  
（同様に `vec3( 1.0 )` や `vec3( 0.7 )` などもできます）  

---

さて、四則演算です。

**ベクトル同士** については、 **ベクトルの各項それぞれで演算を行った場合と同じ** です。  
例えば、 `v` と `v2` が `vec3` の場合、  
`v + v2` は  
`vec3( v.x + v2.x, v.y + v2.y, v.z + v2.z )` と同じです。  
`-` 、 `*` 、 `/` についても同様です。

**ベクトルとfloat** については、 **ベクトルの各項をfloatと演算した場合と同じ** です。  
例えば、 `v` が `vec3` 、 `a` が `float` の場合、  
`v + a` は
`vec3( v.x + a, v.y + a, v.z + a )` と同じです。  
`-` 、 `*` 、 `/` についても同様です。

---

また、 `+=` 、 `-=` 、 `*=` 、 `/=` も使えます。  
**`v += vec3( a, b, c )`** は  
**`v = v + vec3( a, b, c )`** と同じです。  
