const input = document.querySelector('#input')
const output = document.querySelector('#output');

let documentos = [];
let diccionarioGlobal = {};

const limpiarTermino = ((termino) => {
    termino = termino.toLowerCase().replace(/,|\.|' '|\?|!/g, '');
    return STOPWORDS.includes(termino) ? '' : termino;
});

const extraerTerminos = ((documento, index) => {
    let terminos = documento.split(" ");
    let diccionario = {};

    // Quito signos y filtro por stopwords
    terminos = terminos.map((termino) => limpiarTermino(termino))

    // Elimino posiciones en blanco
    terminos = terminos.filter((termino) => termino !== '');

    // Cuentos las repeticiones de los teminos en el doc y el total de terminos en el doc
    terminos.forEach(termino => termino in diccionario ? diccionario[termino]++ : diccionario[termino] = 1);
    terminos.forEach(termino => termino in diccionarioGlobal ? diccionarioGlobal[termino]++ : diccionarioGlobal[termino] = 1);

    // Guardo esta informacion reutilizando la variable documentos
    const inf = { terminos: diccionario, cont: terminos.length }
    documentos[index] = inf;
})

const cargarDocumentos = (() => {
    documentos = input.value.split('\n');
    documentos.forEach((documento, index) => {
        extraerTerminos(documento, index);
    });
})

const calcularMatriz = (() => {
    documentos = [];
    diccionarioGlobal = {};
    cargarDocumentos();
    borrarMatrices();
    crearMatrices();
});

const calcularTF = ((termino, indexDocumento) => {
    return documentos[indexDocumento].terminos[termino] / documentos[indexDocumento].cont
});

const calcularIDF = ((termino) => {
    return Math.log(documentos.length / diccionarioGlobal[termino]);
});

const productoArrays = ((a1, a2) => {
    return a1.map((x, i) => a1[i] * a2[i]).reduce((a, b) => a + b);
});

const longitudArray = ((a) => {
    return Math.sqrt(a.map((num) => Math.pow(num, 2)).reduce((a, b) => a + b));
});

const similitudCoseno = ((doc1, doc2) => {
    let vdoc1 = Object.keys(diccionarioGlobal).map((terminoG) => terminoG in doc1.terminos ? doc1.terminos[terminoG] : 0);
    let vdoc2 = Object.keys(diccionarioGlobal).map((terminoG) => terminoG in doc2.terminos ? doc2.terminos[terminoG] : 0);
    return (productoArrays(vdoc1, vdoc2) / (longitudArray(vdoc1) * longitudArray(vdoc2)));
});

const borrarMatrices = (() => {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
});

const crearMatrices = (() => {
    output.innerHTML = `
    <hr>
    <h2>Matrices por documento</h2>
    <div class="mb-3 mt-3 container" id="matriz-output">
    </div>
    <h2>Similaridad coseno</h2>
    <div class="mb-3 mt-3 container" id="detalles">
    </div>
    `
    const matrizOutput = document.querySelector('#matriz-output');
    const coseno = document.querySelector('#detalles');

    documentos.forEach((terminos, i) => {

        const h3 = document.createElement('h3');
        h3.innerText = `Documento : ${i}`;
        matrizOutput.appendChild(h3);

        const div = document.createElement('div');
        div.className = 'table-responsive tableFixHead';

        const table = document.createElement('table');
        table.className = 'table table-bordered'
        div.appendChild(table);

        const thead = document.createElement('thead');
        table.appendChild(thead);

        const tr = document.createElement('tr');
        thead.appendChild(tr);

        const th = document.createElement('th')
        th.innerText = '#'
        tr.appendChild(th);

        const th1 = document.createElement('th')
        th1.innerText = 'Termino'
        tr.appendChild(th1);

        const th2 = document.createElement('th')
        th2.innerText = 'TF'
        tr.appendChild(th2);

        const th3 = document.createElement('th')
        th3.innerText = 'IDF'
        tr.appendChild(th3);

        const th4 = document.createElement('th')
        th4.innerText = 'TF-IDF'
        tr.appendChild(th4);

        const tbody = document.createElement('tbody');

        Object.keys(documentos[i].terminos).forEach((termino, j) => {

            const tr = document.createElement('tr');

            const indice = document.createElement('th');
            indice.innerText = j;
            tr.appendChild(indice);

            const terminoDoc = document.createElement('th');
            terminoDoc.innerText = termino;
            tr.appendChild(terminoDoc);

            const terminoTF = document.createElement('td');
            terminoTF.innerText = calcularTF(termino, i);
            tr.appendChild(terminoTF);

            const terminoIDF = document.createElement('td');
            terminoIDF.innerText = calcularIDF(termino);
            tr.appendChild(terminoIDF);

            const terminoTFIDF = document.createElement('td');
            terminoTFIDF.innerText = terminoTF.innerText * terminoIDF.innerText;
            tr.appendChild(terminoTFIDF);

            tbody.appendChild(tr)
        });

        table.appendChild(tbody);
        matrizOutput.appendChild(div);

    });

    const div = document.createElement('div');
    div.className = 'table-responsive tableFixHead';

    const table = document.createElement('table');
    table.className = 'table table-bordered'
    div.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tr = document.createElement('tr');
    thead.appendChild(tr);

    const th = document.createElement('th')
    th.innerText = 'Documento'
    tr.appendChild(th);

    const th1 = document.createElement('th')
    th1.innerText = 'Documento'
    tr.appendChild(th1);

    const th2 = document.createElement('th')
    th2.innerText = 'Similitud'
    tr.appendChild(th2);

    const tbody = document.createElement('tbody');

    // for
    documentos.forEach((docA, i)=> {
        documentos.forEach((docB, j) => {
            
            const trb = document.createElement('tr');
        
            const th = document.createElement('th');
            th.innerText = i;
            trb.appendChild(th);
        
            const th2 = document.createElement('th');
            th2.innerText = j;
            trb.appendChild(th2);
        
            const td = document.createElement('td');
            td.innerText = similitudCoseno(docA, docB)
            trb.appendChild(td);
        
            tbody.appendChild(trb);

        });
    });

    table.appendChild(tbody);
    coseno.appendChild(div);

});


// tf = veces que sale el termino en el documento / total de termino del documento
// idf = log( numero total de documentos N / cantidad de documentos en la que el termino esta )
// tf-idf = tf * idf

// coseno = vector de documentos-termino1 * vector de documentos-termino2 / raiz suma de v1 cuadrado * suma de v2 cuadrado