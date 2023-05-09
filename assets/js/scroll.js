
// Menu despegable
const menuHtml = document.querySelector('.menu')
const navbarMenuHTML = document.querySelector('.navbar_menu')
menuHtml.addEventListener("click",(e)=> {
    navbarMenuHTML.classList.toggle("active_navbar_menu")
    const open = e.target.classList.toggle("active_navbar_menu");
    if (open) {
        menuHtml.classList.replace("bxs-dashboard" , "bx-x")
    } else {
        menuHtml.classList.replace("bx-x" , "bxs-dashboard")
    }
})

// Animacion de scroll y Color Home products
const contentNavbarHTML = document.querySelector("header");
const colorAnclas = navbarMenuHTML.querySelectorAll("a");

function animationScroll() {
    window.requestAnimationFrame(() => {
    let y = window.scrollY;
    contentNavbarHTML.classList.toggle("content_navbar_scroll", y > 120);
    colorAnclas.forEach(a => {
        if (a.textContent === 'Home') {
            a.style.color = (window.scrollY < 800) ? 'var(--colorImportante)' : 'inherit'
        }
        if (a.textContent === 'Products') {
            a.style.color = (window.scrollY > 700) ? 'var(--colorImportante)' : 'inherit'
        }
    })
    })
}
window.addEventListener("scroll", animationScroll, { passive: true });
