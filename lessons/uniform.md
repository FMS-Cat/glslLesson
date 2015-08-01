工事中

uniform 変数は、**OpenGLを利用しているプログラミング言語**（ WebGL の場合は JavaScript ）**からGLSLへ渡される変数** です。

今回は、 **`float`** 型の **`time`** という変数を JavaScript から渡しました。  
`time` は、 **シェーダを開始してからの経過時間を秒で返す** 変数です。  
GLSLだけでは時間を取得することができないため、JavaScriptから渡すことになります。  

実際にGLSLで渡されたuniform変数を使うためには、
**`uniform <型> <名前>;`**  
と書くことによって使用可能となります。
