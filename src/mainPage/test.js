let txt =
  '9295   7898701720739   DISCO CORTE   7   FERROSO GALZER  ( CX 20/100)   -   UN   UNID   10   R $7,00   R $0,57   R $0,00   R $69,43 899   SEM GTIN   DISCO DE DESBASTE   7"   UNID   5   R $14,00   R $0,57   R $0,00   R $69,43 903   SEM GTIN   DISCO DE LIXA VELCRO   4.1/2"-   G 80   UNID   11   R $3,00   R $0,27   R $0,00   R $32,73 9468   7908027204698   SUPORTE DISCO LIXA PLUMA   115 MM  120/30   UNID   1   R $20,00   R $0,16   R $0,00   R $19,84 8839   7897801300964   FITA ISOLANTE   10 MT X   19 MM PRETA   -  KRONA   UNID   1   R $15,00   R $0,12   R $0,00   R $14,88 10957   SEM GTIN   SERRA COPO METAL   44 MM   UNID   1   R $42,00   R $0,34   R $0,00   R $41,66 7397   SEM GTIN   SUPORTE SERRA COPO MTX   UNID   1   R $32,00   R $0,26   R $0,00   R $31,74 9573   SEM GTIN   DISCO DE DESBASTE   4"   NORTON   UNID   10   R $7,00   R $0,57   R $0,00   R $69,43 10958   SEM GTIN   PA SX   10   X   65   UNID   50   R $2,20   R $0,90   R $0,00   R $109,10 193   7894507033882   PO TRAV M 10   UNID   50   R $1,25   R $0,51   R $0,00   R $61,99 714   7892183267133   AR LISA M 10   PC   100   R $0,10   R $0,08   R $0,00   R $9,92 235   SEM GTIN   LUVA PIGMENTADA PRETA CA   10464   PC   4   R $3,50   R $0,11   R $0,00   R $13,89 7033   7899612712653   MISTURADOR DE TINTA ,   85   X   8   X   400  MM ,   1   PC // MTX   UNID   1   R $33,00   R $0,27   R $0,00   R $32,73   '


let araySplitRS = txt.split('R $')
let arrayFinal = []
let arrayProdutos = []
let controlador = 0

console.log(araySplitRS)
let textoLinha = ''
for(let j=0;j<araySplitRS.length;j++){

    if(controlador<4){
        textoLinha += araySplitRS[j] + (j>0 && j%4==0 ? '' : "R$")
        controlador += 1
    }else{
        textoLinha += araySplitRS[j].split(' ')[0]
        controlador = 0
    }

    if(j>0 && j%4==0){
        controlador = 0
        console.log(textoLinha)
        arrayFinal.push(textoLinha)
        textoLinha = ''
        textoLinha += araySplitRS[j].split(' ')[1] + " R$"
    }
}

for(let i=0;i<arrayFinal.length;i++){
                    
    let objProduto = {
        CODIGO: arrayFinal[i].split(' ')[0],
        VALOR_UNITARIO: arrayFinal[i].split('R$')[1],
        VALOR_DESCONTO: arrayFinal[i].split('R$')[2],
        VALOR_ACRESCIMO: arrayFinal[i].split('R$')[3],
        VALOT_TOTAL: arrayFinal[i].split('R$')[4] ? arrayFinal[i].split('R$')[4].split(' ')[0] : '',
    }

    arrayProdutos.push(objProduto)

}

console.log(arrayProdutos)
