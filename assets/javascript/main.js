document.querySelector('#btn').addEventListener('click', () => {
    /* funcion que se mantiene escuchando el click al boton */
    const clpMony = document.querySelector('#clpMony').value;
    const mony = document.querySelector('#selectMony').value;
    const result = document.getElementById('results');
    const div = document.getElementById('graphic');
    let showResult = "";
    let myChart = "";
    async function getMony(code) {
        try {
            const url = `https://mindicador.cl/api/${code}`;
            const res = await fetch(url);
            const responseMony = await res.json();
            let convertion;
            if (mony === 'bitcoin') {
                const resDolar = await fetch('https://mindicador.cl/api/dolar');
                const responseDolar = await resDolar.json()
                convertion = (clpMony / responseDolar.serie[0].valor) / responseMony.serie[0].valor
            } else if (mony === 'seleccion' || clpMony === "") {
                alert('Faltan campos por completar');
                return;
            } else {
                convertion = clpMony / responseMony.serie[0].valor
            }
            showResult += `<p class="result">Resultado: ${convertion.toFixed(2)}</p>`
            result.innerHTML = showResult

            const labels = responseMony.serie.map((f) => {
                const date = new Date(Date.parse(f.fecha));
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            })
            const dates = labels.slice(0, 10).reverse();

            const data = responseMony.serie.map((v) => {
                return v.valor
            })
            const values = data.slice(0, 10).reverse();
            myChart += `<canvas id="myChart"></canvas>`
            div.innerHTML = myChart

            const ctx = document.getElementById('myChart');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `Valor ${code} en los ultimos 10 dias`,
                        data: values,
                        borderWidth: 1
                    }]
                }
            })
        } catch (error) {
            alert(error.message)
        }
    }
    getMony(mony);
});