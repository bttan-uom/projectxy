const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener('click', ()=>{
   //Links
    navLinks.classList.toggle("open");
    links.forEach(link => {
        link.classList.toggle("fade");
    });

    //Animation
    hamburger.classList.toggle("toggle");
});


const attentionRequiredSearch = () => {
    const trs = document.querySelectorAll('#attentionRequiredTable tr:not(.header)')
    const filter = document.querySelector('#attentionRequiredInput').value
    const regex = new RegExp(filter, 'i')
    const isFoundInTds = td => regex.test(td.innerHTML)
    const isFound = childrenArr => childrenArr.some(isFoundInTds)
    const setTrStyleDisplay = ({ style, children }) => {
        style.display = isFound([
            ...children // <-- All columns
        ]) ? '' : 'none' 
    }
    
    trs.forEach(setTrStyleDisplay)
}

const allPatientsSearch = () => {
    const trs = document.querySelectorAll('#allPatientsTable tr:not(.header)')
    const filter = document.querySelector('#allPatientsInput').value
    const regex = new RegExp(filter, 'i')
    const isFoundInTds = td => regex.test(td.innerHTML)
    const isFound = childrenArr => childrenArr.some(isFoundInTds)
    const setTrStyleDisplay = ({ style, children }) => {
        style.display = isFound([
            ...children // <-- All columns
        ]) ? '' : 'none' 
    }
    
    trs.forEach(setTrStyleDisplay)
}