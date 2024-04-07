import { useEffect, useState } from 'react'
import './mainPage.css'
import pdfToText from 'react-pdftotext'
const XLSX = require('xlsx')

export default function MainPage(){

    const [fullPDFText, setFullPDFText] = useState('')
    const [loadingArrays, setLoadingArrays] = useState('')

    const readPDFContent = () => {
        setLoadingArrays(<i className="fa-solid fa-spinner fa-spin fa-2xl"></i>)
        const input = document.getElementById("pdf-file-input")
        const file = input.files[0]
        if(file){
            pdfToText(file)
                .then(text => {
                    setFullPDFText(text)
                })
                .catch(error => console.error("Failed to extract text from pdf"))
        }else{
            setLoadingArrays(<b id='mensagem-erro'>Insira o arquivo para minerar os dados!</b>)
        }
    }

    const [arrayProdutosNormal, setArrayProdutosNormal] = useState([])
    const [arrayProdutosAgrupados, setArrayProdutosAgrupados] = useState([])

    useEffect(() => {
        if(fullPDFText){
            let arrayBlocos = fullPDFText.split("Cód")
            let arrayFinal = []
            let arrayProdutos = []

            for(let i=0;i<arrayBlocos.length;i++){
                if(arrayBlocos[i].includes('GTIN')){
                    arrayBlocos[i] = arrayBlocos[i].split('Total')[1].replace(/^\s+/, '')

                    let araySplitRS = arrayBlocos[i].split('R $')
                    let controlador = 0

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
                            arrayFinal.push(textoLinha)
                            textoLinha = ''
                            textoLinha += araySplitRS[j].split(' ')[1] + " R$"
                        }
                    }
                }
            }

            for(let i=0;i<arrayFinal.length;i++){
                    
                let objProduto = {
                    CODIGO: arrayFinal[i].split(' ')[0],
                    QUANTIDADE: parseInt(parseFloat(arrayFinal[i].split('R$')[4].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.'))/parseFloat(arrayFinal[i].split('R$')[1].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.'))),
                    VALOR_UNITARIO: arrayFinal[i].split('R$')[1] ? parseFloat(arrayFinal[i].split('R$')[1].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.')) : '',
                    VALOR_DESCONTO: arrayFinal[i].split('R$')[2] ? parseFloat(arrayFinal[i].split('R$')[2].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.')) : '',
                    VALOR_ACRESCIMO: arrayFinal[i].split('R$')[3] ? parseFloat(arrayFinal[i].split('R$')[3].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.')) : '',
                    VALOR_TOTAL: arrayFinal[i].split('R$')[4] ? parseFloat(arrayFinal[i].split('R$')[4].split(' ')[0].replace(/\./g,'').replace(/\,/g,'.')) : '',
                }
    
                arrayProdutos.push(objProduto)
            }

            // console.log(arrayProdutos)
            function compararPorCodigo(a, b) {
                return a.CODIGO - b.CODIGO
            }
            arrayProdutos.sort(compararPorCodigo)
            setArrayProdutosNormal(arrayProdutos)
        }
        
    },[fullPDFText])

    useEffect(() => {
        if(arrayProdutosNormal.length>0){

            let array = [...arrayProdutosNormal]

            let objetosAgrupados = {}
    
            array.forEach(objeto => {
                if (objetosAgrupados[objeto.CODIGO]) {
                    objetosAgrupados[objeto.CODIGO].QUANTIDADE += objeto.QUANTIDADE
                    objetosAgrupados[objeto.CODIGO].VALOR_UNITARIO += objeto.VALOR_UNITARIO
                    objetosAgrupados[objeto.CODIGO].VALOR_DESCONTO += objeto.VALOR_DESCONTO
                    objetosAgrupados[objeto.CODIGO].VALOR_ACRESCIMO += objeto.VALOR_ACRESCIMO
                    objetosAgrupados[objeto.CODIGO].VALOR_TOTAL += objeto.VALOR_TOTAL
                } else {
                    objetosAgrupados[objeto.CODIGO] = { 
                        CODIGO: objeto.CODIGO, 
                        QUANTIDADE: objeto.QUANTIDADE, 
                        VALOR_UNITARIO: objeto.VALOR_UNITARIO, 
                        VALOR_DESCONTO: objeto.VALOR_DESCONTO, 
                        VALOR_ACRESCIMO: objeto.VALOR_ACRESCIMO, 
                        VALOR_TOTAL: objeto.VALOR_TOTAL, 
                    }
                }
            })
        
            // console.log(Object.values(objetosAgrupados))
            setLoadingArrays(<b id='mensagem-confirmar'>Download da planilha iniciado.</b>)
            exportarParaExcel(arrayProdutosNormal,Object.values(objetosAgrupados))
            setArrayProdutosAgrupados(Object.values(objetosAgrupados))

        }
        
    },[arrayProdutosNormal])


    function exportarParaExcel(array1, array2) {
        // Função para converter um array para uma aba do Excel
        function arrayParaWorksheet(array, nomeAba) {
            let worksheet = XLSX.utils.json_to_sheet(array)
            return { [nomeAba]: worksheet }
        }
    
        // Converter os arrays para abas do Excel
        let worksheet1 = arrayParaWorksheet(array1, "TODOS OS PRODUTOS")
        let worksheet2 = arrayParaWorksheet(array2, "PRODUTOS AGRUPADOS")
    
        // Criar um workbook e adicionar as abas
        let workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet1["TODOS OS PRODUTOS"], "TODOS OS PRODUTOS")
        XLSX.utils.book_append_sheet(workbook, worksheet2["PRODUTOS AGRUPADOS"], "PRODUTOS AGRUPADOS")
    
        // Salvar o workbook como um arquivo Excel
        XLSX.writeFile(workbook, "Planilha produtos.xlsx")
    }

    return (
        <>
            <div className='main-block'>
                <div className='content-container'>

                    <div className='input-div'>
                        <h2>Insira o arquivo em formato PDF</h2>
                        <input id="pdf-file-input" type="file"/>
                    </div>

                    <div className='buttons-line'>

                        <button className='buttons-minerar-style' onClick={readPDFContent}>
                            MINERAR DADOS
                        </button>

                    </div>

                    <div style={{margin:'25px 0'}}>
                        {loadingArrays}
                    </div>

                </div>
            </div>        
        </>
    )
    
}