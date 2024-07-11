// Adding sticky navbar 
const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", this.window.scrollY >= 55);
});

// For Focus on Contact Form 
document.addEventListener('DOMContentLoaded', function () {

    const inputs = document.querySelectorAll(".contact-input");

    inputs.forEach((ipt) => {
        ipt.addEventListener("focus", () => {
            ipt.parentNode.classList.add("focus");
            ipt.parentNode.classList.add("not-empty");
        });

        ipt.addEventListener("blur", () => {
            if (ipt.value == "") {
                ipt.parentNode.classList.remove("not-empty");
            }
            ipt.parentNode.classList.remove("focus");
        });

        const storedValue = localStorage.getItem(ipt.name);

        if(storedValue) {
            ipt.value = storedValue;
            ipt.parentNode.classList.add("not-empty");
        }

        ipt.addEventListener("input", ()=> {
            localStorage.setItem(ipt.name, ipt.value);
        });
    });
});

// Adding Scroll Top
function scrollUp () {
    const scrollUp = document.getElementById("scroll-up");
    if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
    else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// Underline scroll and resize 
function updateUnderlinePosition() {
    
    const sections = document.querySelectorAll("section");

    let currentSection = null;

    sections.forEach((section) => {

        const rect = section.getBoundingClientRect();

       if(rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2 ) {
            currentSection = section;
        }
    });

  if (currentSection) {
    
    const correspondingLink = document.querySelector(
      `a[href="#${currentSection.id}"]`
    );

    const underline = document.querySelector(".underline");

    if (correspondingLink && underline) {
      const linkRect = correspondingLink.getBoundingClientRect();

      const containerOffset = correspondingLink.offsetLeft;

      underline.style.width = linkRect.width + "px";

      underline.style.transform = `translateX(${containerOffset}px)`;
    }
  }
}

// Event listeners for scroll and resize events
window.addEventListener("scroll", updateUnderlinePosition);
window.addEventListener("resize", updateUnderlinePosition);

window.addEventListener("load", function() {
    this.setTimeout(updateUnderlinePosition, 100);
})

// ======== Dark Theme =========
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "bx-sun";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? "dark" : "light";

const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

if(selectedTheme) {

    document.body.classList[selectedTheme === "dark" ? "add" : "remove"] (darkTheme);

    themeButton.classList[selectedIcon === "bx-moon" ? "add" : "remove"](iconTheme);

    if(selectedTheme === "dark"){
        themeButton.style.color = "#fff";
    }
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);

    themeButton.classList.toggle(iconTheme);
    themeButton.classList.toggle("bx-moon");

    if (getCurrentTheme() === "dark") {
        themeButton.style.color = "#fff";
    } else {
        themeButton.style.color = "";
    }

    document.body.style.transition = "background-color 1s";

    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

document.body.addEventListener('transitionend', () => {
    document.body.style.transition = "";
});

// -------------------------------
//Menu Icon
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = (e) => {

    e.preventDefault();

    menu.classList.toggle("bx-x");
    navbar.classList.toggle("open");
};

let navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {

    link.addEventListener("click", (e) => {
        e.preventDefault();

        let targetId = link.querySelector("a").getAttribute("href");
        
        document.querySelector(targetId).scrollIntoView({ behavior: "smooth"});

        if (navbar.classList.contains("open")) {
            menu.classList.toggle("bx-x");
            navbar.classList.toggle("open");
        }
    });
});

// Handle form submission
const contactForm = document.getElementById('contact-form');
const errorDiv = document.getElementById('error-message');

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.innerText = 'Processing your message...';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.zIndex = '1000';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const inputs = contactForm.querySelectorAll('.contact-input');
    let hasError = false;
    let errorMessage = '';

    inputs.forEach(input => {
        if (!input.value.trim()) {
            hasError = true;
            errorMessage = 'Please fill out all fields.';
        }
    });

    if (hasError) {

        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
    } else {

        errorDiv.style.display = 'none';

        showLoading();

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            hideLoading();

            alert('Your message has been sent successfully!');
            inputs.forEach(input => input.value = '');
            localStorage.clear();

            window.location.href = 'https://angeladanelle13.github.io/portfolio-website/';
        })
        .catch(error => {

            hideLoading();

            console.error('There was an error submitting the form:', error);
            alert('There was an error submitting the form. Please try again.');
        });
    }
});
