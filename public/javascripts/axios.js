const apiURI = '/api'

const axiosGetName = (e) => {
    e = window.event
    const apiURL = `${apiURI}/subject/${e.target.innerText}`
    axios
        .get(apiURL)
        .then(response => {
            const tests = response.data
            const div = document.getElementById('tests')
            div.innerText = ''
            tests.forEach(test => {
                const newDiv = document.createElement('div')
                newDiv.classList.add('container-mk', 'column-mk', 'card', 'shadow')
                newDiv.innerHTML = `
            <a href="/test/do/${test._id}">
                    <h3 class="text-center">${test.title}</h3>
                    <p class="text-center">Temario: ${test.subject}</p>
            </a>
                `
                div.append(newDiv)
            })
        })
        .catch(err => {
            console.error(err)
        })
}
const axiosAll = () => {
    const apiURL = `${apiURI}/all`
    axios
        .get(apiURL)
        .then(response => {
            const tests = response.data
            const div = document.getElementById('tests')
            div.innerText = ''
            tests.forEach(test => {
                const newDiv = document.createElement('div')
                newDiv.classList.add('container-mk', 'column-mk', 'card', 'shadow')
                newDiv.innerHTML = `
            <a href="/test/do/${test._id}">
                    <h3 class="text-center">${test.title}</h3>
                    <p class="text-center">Temario: ${test.subject}</p>
            </a>
                `
                div.append(newDiv)
            })
        })
        .catch(err => {
            console.error(err)
        })
}
const axiosRandom = () => {
    const apiURL = `${apiURI}/all`
    axios
        .get(apiURL)
        .then(response => {
            const tests = response.data
            const random = Math.floor((Math.random()* tests.length))
            const div = document.getElementById('tests')
            div.innerText = ''
                const newDiv = document.createElement('div')
                newDiv.classList.add('container-mk', 'column-mk', 'card', 'shadow')
                newDiv.innerHTML = `
            <a href="/test/do/${tests[random]._id}">
                    <h3 class="text-center">${tests[random].title}</h3>
                    <p class="text-center">Temario: ${tests[random].subject}</p>
            </a>
                `
                div.append(newDiv)
        })
        .catch(err => {
            console.error(err)
        })
}
const axiosSearchSubject = (e) => {
    e = window.event
    e.preventDefault()
    const subject = document.getElementById('search').value
    const apiURL = `${apiURI}/subject/${subject}`
    axios
        .get(apiURL)
        .then(response => {
            const tests = response.data
            const div = document.getElementById('tests')
            div.innerText = ''
            tests.forEach(test => {
                const newDiv = document.createElement('div')
                newDiv.classList.add('container-mk', 'column-mk', 'card', 'shadow')
                newDiv.innerHTML = `
            <a href="/test/do/${test._id}">
                    <h3 class="text-center">${test.title}</h3>
                    <p class="text-center">Temario: ${test.subject}</p>
            </a>
                `
                div.append(newDiv)
            })
        })
        .catch(err => {
            console.error(err)
        })
}
const axiosSearchTitle = (e) => {
    e = window.event
    e.preventDefault()
    const title = document.getElementById('search').value
    const apiURL = `${apiURI}/title/${title}`
    axios
        .get(apiURL)
        .then(response => {
            const tests = response.data
            console.log(tests)
            const div = document.getElementById('tests')
            div.innerText = ''
            tests.forEach(test => {
                const newDiv = document.createElement('div')
                newDiv.classList.add('container-mk', 'column-mk', 'card', 'shadow')
                newDiv.innerHTML = `
            <a href="/test/do/${test._id}">
                    <h3 class="text-center">${test.title}</h3>
                    <p class="text-center">Temario: ${test.subject}</p>
            </a>
                `
                div.append(newDiv)
            })
        })
        .catch(err => {
            console.error(err)
        })
}
