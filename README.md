# Porfolio
KIM Portfolio
Personal portfolio website for Kent Ivan Manuel C. Gabito — a third-year BSIT student at Davao del Norte State College (DNSC).

A single-page, editorial-style portfolio built with HTML, Tailwind CSS, and vanilla JavaScript, showcasing skills, certificates, services, and academic projects organized by year.

Features
Single-page layout — Home, About, Certificates, Services, Projects, and Contact
Editorial / brutalist design — grid backgrounds, thin borders, generous spacing, serif + sans-serif typography
Theme switcher — 5 accent colors with dark mode toggle (saved to localStorage)
Scroll animations — fade/slide reveal on scroll (respects prefers-reduced-motion)
Marquee tickers — animated tech keyword strip
Skills section — progress bars for 20+ technologies
Certificate gallery — clickable cards with lightbox modal
Project showcase — organized by First Year, Second Year, and Third Year with carousel modal
Mobile responsive — collapsible nav, portrait/mobile project layout auto-detection
Back to Top — footer link with smooth scroll
Tech Stack
Category	Technologies
Frontend
HTML5, Tailwind CSS (CDN), Vanilla JavaScript
Fonts
Cormorant Garamond, DM Sans (Google Fonts)
Icons
Font Awesome 6
Styling
CSS custom properties, alternate stylesheets for themes
Project Structure
Porfolio/
├── index.html              # Main portfolio page
├── projects.js             # Project data + dynamic card/modal rendering
├── style-switcher.js       # Theme color + dark mode logic
├── color-1.css … color-5.css   # Accent color themes
├── style.css               # Legacy styles (optional)
├── style-switcher.css      # Style switcher panel styles
├── script.js               # Legacy scripts (optional)
└── images/
    ├── Profile Pic/        # Profile photo
    ├── Certificates/       # Certificate images
    ├── First Year/         # First-year project screenshots
    ├── Second Year/        # Second-year project screenshots
    └── Third Year/         # Third-year project screenshots
Sections
Home
Hero intro with typing animation, profile image, and quick navigation.

About
Bio, personal details (age, location, email), skill progress bars, and download/contact links.

Certificates
9 certificates including Cisco Packet Tracer, Data Analytics, UX Questionnaire, Ignite Philippines, and competition awards.

Services
Front End, Back End, Full Stack, Mobile App, Database & API, Cloud & Firebase.

Projects
Year	Projects
First Year
Cafe, DNSC-IDEAS, Group, Machine Problem, Nike, Poster
Second Year
Rose, Second, Traveler, WasteWise
Third Year
NeighborHelp, RentiFi, VitalDrop
Click any project card to open a carousel modal with prev/next navigation and pagination dots.

Contact
Contact form, email, and social links (GitHub, Upwork, LinkedIn, Facebook).

Theme Colors
Use the gear icon on the right side of the page to switch accent colors:

Theme	Color
Color 1
Red #ec1839
Color 2
Orange #fa5b0f
Color 3
Green #37b182
Color 4
Blue #1854b4
Color 5
Pink #f021b2
Theme and dark mode preferences are saved in localStorage.

Adding a New Project
Add screenshots to images/[Year]/[Project Name]/
Update projects.js under the correct year:
"Third Year": {
    "Your Project": [
        "images/Third Year/Your Project/screenshot-1.png",
        "images/Third Year/Your Project/screenshot-2.png"
    ]
}
Refresh the page — the project card will render automatically.
Contact
Kent Ivan Manuel C. Gabito
Email: kentivanmanuelgabito@gmail.com
GitHub: LeunaM1917
Upwork: Profile

License
This project is for personal portfolio use. All project screenshots and assets belong to their respective owners.
