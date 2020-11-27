const addValidQuestion = (e) => {
    e = window.event
    e.preventDefault()
    const valids = document.getElementById('valids')
    const newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.name= 'validAnswers'
    newInput.autofocus = true
    valids.append(newInput)
}
const addWrongQuestion = (e) => {
    e = window.event
    e.preventDefault()
    const wrongs = document.getElementById('wrongs')
    const newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.name= 'wrongAnswers'
    wrongs.append(newInput)
}
const addNewQuestion = (e) => {
    e = window.event
    e.preventDefault()
    
}