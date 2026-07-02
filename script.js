document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       MOBILE MENU HAMBURGER TOGGLE
       ========================================== */
    const menuToggle = document.querySelector('.nav-hamburger-toggle');
    const navMenuBar = document.querySelector('.nav-menu-bar');

    if (menuToggle && navMenuBar) {
        menuToggle.addEventListener('click', () => {
            navMenuBar.classList.toggle('active-mobile');
            menuToggle.classList.toggle('open');
        });
    }

    // CSS styling helper for mobile active navigation state
    const styleElem = document.createElement('style');
    styleElem.innerHTML = `
        @media (max-width: 1024px) {
            .nav-menu-bar {
                display: none;
                width: 100%;
                background-color: var(--bg-white);
                border-top: 1px solid var(--border-color);
                position: absolute;
                top: 100%;
                left: 0;
                padding: 20px;
                box-shadow: var(--shadow-card);
            }
            .nav-menu-bar.active-mobile {
                display: block;
            }
            .nav-menu-links {
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
                gap: 5px;
            }
            .nav-menu-item {
                width: 100%;
            }
            .nav-menu-link {
                width: 100%;
                justify-content: space-between;
                padding: 12px 10px;
            }
            .nav-submenu {
                position: static;
                width: 100%;
                box-shadow: none;
                border: none;
                border-left: 2px solid var(--brand-red);
                margin-left: 10px;
                display: none;
                opacity: 1;
                visibility: visible;
                transform: none;
            }
            .nav-menu-item.open-submenu .nav-submenu {
                display: block;
            }
            .nav-hamburger-toggle.open span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            .nav-hamburger-toggle.open span:nth-child(2) {
                opacity: 0;
            }
            .nav-hamburger-toggle.open span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
        }
    `;
    document.head.appendChild(styleElem);

    // Accordion submenu behaviors for smaller viewport devices
    document.querySelectorAll('.nav-menu-item.has-dropdown').forEach(item => {
        const link = item.querySelector('.nav-menu-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                item.classList.toggle('open-submenu');
            }
        });
    });


    /* ==========================================
       UNIVERSITY PARTNERS LOGOS CAROUSEL SLIDE
       ========================================== */
    const track = document.querySelector('.uni-logos-slider-track');
    const prevBtn = document.querySelector('.prev-uni');
    const nextBtn = document.querySelector('.next-uni');
    
    if (track && prevBtn && nextBtn) {
        let scrollAmount = 0;
        const cardWidth = 240; // card 220px + gap 20px
        
        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
            scrollAmount += cardWidth;
            if (scrollAmount > maxScroll) {
                scrollAmount = 0; // loop back to first
            }
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });

        prevBtn.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            if (scrollAmount < 0) {
                scrollAmount = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
            }
            track.style.transform = `translateX(-${scrollAmount}px)`;
        });

        // Auto transition university logos
        setInterval(() => {
            nextBtn.click();
        }, 5000);
    }


    /* ==========================================
       STUDENT TESTIMONIALS SLIDER
       ========================================== */
    const slides = document.querySelectorAll('.story-slide-card');
    const dots = document.querySelectorAll('.story-dot');
    
    const showTestimonialSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) dot.classList.add('active');
        });
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showTestimonialSlide(index);
        });
    });

    // Auto rotate testimonials
    let currentTestimonial = 0;
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % slides.length;
        showTestimonialSlide(currentTestimonial);
    }, 8000);


    /* ==========================================
       APPLICATION INQUIRY FORM SUBMISSION
       ========================================== */
    const inquiryForm = document.getElementById('inquiry-application-form');
    const successOverlay = document.getElementById('app-form-success-overlay');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check form validity
            if (!inquiryForm.checkValidity()) {
                inquiryForm.reportValidity();
                return;
            }

            // Simple submission animation transition
            inquiryForm.classList.add('hidden');
            successOverlay.classList.remove('hidden');
            
            // Auto hide success overlay and reset form after 7 seconds
            setTimeout(() => {
                inquiryForm.reset();
                inquiryForm.classList.remove('hidden');
                successOverlay.classList.add('hidden');
            }, 7000);
        });
    }


    /* ==========================================
       INTERACTIVE BRANCH SELECTION (MAP & DETAILS)
       ========================================== */
    const branchData = {
        putalisadak: {
            name: "Putalisadak Head Office",
            desc: "Way to Bagbazar (Opposite Nepal Investment Mega Bank), Kathmandu, Nepal",
            phone: "+977-1-4433221, 4433222",
            email: "info@cambridge.edu.np"
        },
        lalitpur: {
            name: "Lagankhel Branch (Lalitpur)",
            desc: "Ground Floor, Lalitpur Mall, Lagankhel, Lalitpur, Nepal",
            phone: "+977-1-5544332",
            email: "lalitpur@cambridge.edu.np"
        },
        pokhara: {
            name: "Chipledhunga Branch (Pokhara)",
            desc: "Second Floor, Pokhara Trade Mall, Chipledhunga, Pokhara, Nepal",
            phone: "+977-61-532211",
            email: "pokhara@cambridge.edu.np"
        },
        chitwan: {
            name: "Chaubiskoti Branch (Chitwan)",
            desc: "Opposite Bharatpur Hospital, Chaubiskoti, Bharatpur, Chitwan, Nepal",
            phone: "+977-56-523311",
            email: "chitwan@cambridge.edu.np"
        }
    };

    const branchTabs = document.querySelectorAll('.branch-tab');
    const branchPins = document.querySelectorAll('.branch-pin-pulse');
    const displayTitle = document.getElementById('active-branch-name');
    const displayDesc = document.getElementById('active-branch-desc');
    const displayContacts = document.getElementById('active-branch-contacts');

    const updateBranchDetailsCard = (branchKey) => {
        const data = branchData[branchKey];
        if (!data) return;

        // Update card text
        displayTitle.textContent = data.name;
        displayDesc.textContent = data.desc;
        displayContacts.innerHTML = `<i class="fa-solid fa-phone"></i> ${data.phone} &nbsp;&nbsp;|&nbsp;&nbsp; <i class="fa-solid fa-envelope"></i> ${data.email}`;

        // Sync tab buttons active state
        branchTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-branch') === branchKey) {
                tab.classList.add('active');
            }
        });

        // Sync map pins active state
        branchPins.forEach(pin => {
            pin.classList.remove('active');
            if (pin.id === `pin-${branchKey}`) {
                pin.classList.add('active');
            }
        });
    };

    // Attach listeners on tab buttons
    branchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const branchKey = tab.getAttribute('data-branch');
            updateBranchDetailsCard(branchKey);
        });
    });

    // Attach listeners on map pins
    branchPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const branchKey = pin.id.replace('pin-', '');
            updateBranchDetailsCard(branchKey);
        });
    });


    /* ==========================================
       MODAL TRIGGERS AND GENERAL HANDLERS
       ========================================== */
    const showModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    };

    const hideModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    };

    // Close buttons binding
    document.getElementById('close-dest-modal')?.addEventListener('click', () => hideModal('dest-details-modal'));
    document.getElementById('close-utils-modal')?.addEventListener('click', () => hideModal('utilities-modal'));
    document.getElementById('close-news-modal')?.addEventListener('click', () => hideModal('news-offers-modal'));
    document.getElementById('close-login-modal')?.addEventListener('click', () => hideModal('counselor-login-modal'));

    // Close modals on clicking outside the content box
    document.querySelectorAll('.custom-modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // Bind Speak with us buttons in main header
    document.querySelectorAll('.speak-with-us-btn').forEach(btn => {
        if (btn.tagName === 'BUTTON' || btn.getAttribute('href') === '#application-form-section') {
            btn.addEventListener('click', (e) => {
                // If it's the Speak With Us red button, let's scroll to the application form
                const formSection = document.getElementById('application-form-section');
                if (formSection) {
                    e.preventDefault();
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Header Links binding (News, Counselor Dashboard, Login)
    const utilityNewsLink = document.querySelector('a[href="#news-offers"]');
    if (utilityNewsLink) {
        utilityNewsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('news-offers-modal');
        });
    }

    const utilityDashboardLink = document.querySelector('a[href="#counselor-dashboard"]');
    if (utilityDashboardLink) {
        utilityDashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('counselor-login-modal');
        });
    }

    const utilityLoginLink = document.querySelector('a[href="#login"]');
    if (utilityLoginLink) {
        utilityLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('counselor-login-modal');
        });
    }


    /* ==========================================
       DESTINATIONS DETAIL MODAL DATA & BINDINGS
       ========================================== */
    const destinationsData = {
        australia: {
            title: "Study in Australia",
            flag: "🇦🇺",
            overview: "Australia offers world-class education, vibrant student cities, and post-study work opportunities. It is currently one of the top destinations for Nepalese students due to its flexible academic pathways.",
            intakes: "February, July, November",
            fees: "AUD 22,000 - 45,000 / Year",
            living: "AUD 29,710 / Year",
            english: "IELTS: 6.0 (no band < 5.5) | PTE: 50+",
            reqs: [
                "Academic transcripts (GPA 2.8+ preferred for 10+2/Bachelor)",
                "Proof of financial capacity (showing 1 year of tuition & living costs)",
                "Genuine Student (GS) statement outlining career goals",
                "Overseas Student Health Cover (OSHC)"
            ]
        },
        usa: {
            title: "Study in USA",
            flag: "🇺🇸",
            overview: "The United States is home to the world's most prestigious universities, offering unmatched academic flexibility, research facilities, and Optional Practical Training (OPT) work opportunities.",
            intakes: "January (Spring), August (Fall)",
            fees: "USD 18,000 - 40,000 / Year",
            living: "USD 12,000 - 18,000 / Year",
            english: "IELTS: 6.5 | PTE: 54+ | TOEFL: 80+",
            reqs: [
                "Form I-20 financial support documentation from a sponsor",
                "Statement of Purpose (SOP) & Letter of Recommendation",
                "Standardized test scores (SAT/ACT or GRE/GMAT) for scholarships",
                "F-1 visa interview appointment at US Embassy Kathmandu"
            ]
        },
        uk: {
            title: "Study in United Kingdom",
            flag: "🇬🇧",
            overview: "The UK is famous for fast-track degree courses (3 years Bachelor, 1 year Masters), historic universities, and a 2-year Graduate Route visa for international students.",
            intakes: "January, September",
            fees: "GBP 13,000 - 26,000 / Year",
            living: "GBP 12,000 - 15,000 / Year",
            english: "IELTS: 6.0 (no band < 5.5) | PTE: 51+",
            reqs: [
                "Academic certificate with no major study gaps",
                "TB test certificate from IOM Kathmandu",
                "Credibility interview cleared by the university",
                "Bank balance certificate held for 28 consecutive days"
            ]
        },
        canada: {
            title: "Study in Canada",
            flag: "🇨🇦",
            overview: "Canada offers high-quality public colleges and universities, a safe environment, and a direct path to permanent residency via the Post-Graduation Work Permit (PGWP).",
            intakes: "January, May, September",
            fees: "CAD 16,000 - 32,000 / Year",
            living: "CAD 20,635 / Year",
            english: "IELTS: 6.0 (no band < 6.0) | PTE: 60+",
            reqs: [
                "Guaranteed Investment Certificate (GIC) from a Canadian Bank",
                "Payment of 1 year of tuition fees in advance",
                "Detailed Study Plan explaining course fit",
                "Biometrics submission at VFS Global Kathmandu"
            ]
        },
        newzealand: {
            title: "Study in New Zealand",
            flag: "🇳🇿",
            overview: "New Zealand provides scenic living, hands-on practical education, and post-study work visa rights in sectors with critical skill shortages.",
            intakes: "February, July",
            fees: "NZD 24,000 - 38,000 / Year",
            living: "NZD 20,000 / Year",
            english: "IELTS: 6.0 | PTE: 50+",
            reqs: [
                "Funds showing tuition fees plus NZD 20,000 living costs",
                "PCC (Police Clearance Certificate) from Nepal Police",
                "Chest X-ray medical examination report",
                "SOP explaining career value of the qualification"
            ]
        },
        germany: {
            title: "Study in Germany",
            flag: "🇩🇪",
            overview: "Germany is a global engineering powerhouse with tuition-free public universities. Students can study in English while enjoying low costs via blocked accounts.",
            intakes: "April (Summer), October (Winter)",
            fees: "EUR 0 (Public) | EUR 10,000+ (Private)",
            living: "EUR 11,208 / Year",
            english: "IELTS: 6.5 (for English taught) | German B2 (for German taught)",
            reqs: [
                "APS Certificate issued by APS India/Germany",
                "Opening a Blocked Account (Sperrkonto) with EUR 11,208",
                "Academic transcripts with good CGPA",
                "Motivation letter detailing career plans"
            ]
        },
        france: {
            title: "Study in France",
            flag: "🇫🇷",
            overview: "France is a leading destination for culinary arts, fashion, business, and luxury management. Many courses are taught in English with government housing subsidies.",
            intakes: "January, September",
            fees: "EUR 3,000 - 15,000 / Year",
            living: "EUR 8,000 / Year",
            english: "IELTS: 6.0 | PTE: 50+",
            reqs: [
                "Campus France Interview registration",
                "Academic records and CV in English/French",
                "Proof of accommodation for the first 3 months",
                "Financial proof showing EUR 615 per month"
            ]
        },
        japan: {
            title: "Study in Japan",
            flag: "🇯🇵",
            overview: "Japan combines ancient traditions with cutting-edge technology. Students can work part-time up to 28 hours a week while studying language or specialized vocational courses.",
            intakes: "April, July, October, January",
            fees: "JPY 600,000 - 900,000 / Year",
            living: "JPY 1,000,000 / Year",
            english: "Japanese NAT-TEST / JLPT N5 (Minimum requirement)",
            reqs: [
                "Certificate of Eligibility (COE) document from Japanese Immigration",
                "150+ hours of Japanese language study proof",
                "Sponsor relationship documents and bank statement",
                "Academic transcripts showing school completion"
            ]
        },
        korea: {
            title: "Study in South Korea",
            flag: "🇰🇷",
            overview: "South Korea is a major tech and entertainment hub, offering affordable tuition, high-tech campuses, and job search options after degree completion.",
            intakes: "March, September",
            fees: "KRW 4,000,000 - 8,000,000 / Semester",
            living: "KRW 800,000 / Month",
            english: "TOPIK Level 3 (Korean) or IELTS 5.5 (English)",
            reqs: [
                "Certificate of Admission from a recognized Korean University",
                "Financial sponsor bank certificate showing USD 20,000",
                "Apostilled or Consular-verified academic documents",
                "Medical certificate showing negative Tuberculosis test result"
            ]
        }
    };

    const openCountryDetail = (countryName) => {
        const cleanName = countryName.toLowerCase()
            .replace('united kingdom', 'uk')
            .replace('south korea', 'korea')
            .replace('new zealand', 'nz')
            .trim();
            
        const data = destinationsData[cleanName];
        if (data) {
            document.getElementById('dest-flag').textContent = data.flag;
            document.getElementById('dest-title').textContent = data.title;
            document.getElementById('dest-overview').textContent = data.overview;
            document.getElementById('dest-intakes').textContent = data.intakes;
            document.getElementById('dest-fees').textContent = data.fees;
            document.getElementById('dest-living').textContent = data.living;
            document.getElementById('dest-english').textContent = data.english;
            
            const reqList = document.getElementById('dest-requirements-list');
            reqList.innerHTML = '';
            data.reqs.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req;
                reqList.appendChild(li);
            });
            
            showModal('dest-details-modal');
        }
    };

    // Bind clicks on world map dots
    document.querySelectorAll('.map-dot-pulse').forEach(dot => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            const label = dot.nextElementSibling;
            if (label && label.tagName === 'text') {
                openCountryDetail(label.textContent.trim());
            }
        });
    });

    // Bind clicks on world map labels
    document.querySelectorAll('.map-label-txt').forEach(lbl => {
        lbl.style.cursor = 'pointer';
        lbl.addEventListener('click', () => {
            openCountryDetail(lbl.textContent.trim());
        });
    });

    // Bind header study abroad submenu items
    document.querySelectorAll('a[data-country]').forEach(subItem => {
        subItem.addEventListener('click', (e) => {
            e.preventDefault();
            const countryKey = subItem.getAttribute('data-country');
            // Handle naming corrections if needed
            let searchKey = countryKey;
            if (countryKey === 'newzealand') searchKey = 'new zealand';
            openCountryDetail(searchKey);
        });
    });

    // Handle 'Book Free Counseling' button in Destination Modal
    document.getElementById('dest-book-session-btn')?.addEventListener('click', (e) => {
        hideModal('dest-details-modal');
        // Let it scroll to form
    });


    /* ==========================================
       STUDENT UTILITIES MODAL (TABBED CONTROLLER)
       ========================================== */
    const utilTabs = document.querySelectorAll('.util-tab-btn');
    const utilContents = document.querySelectorAll('.util-tab-content');

    const switchUtilityTab = (tabName) => {
        utilTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-util-tab') === tabName) {
                tab.classList.add('active');
            }
        });
        utilContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `utab-${tabName}`) {
                content.classList.add('active');
            }
        });
    };

    utilTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-util-tab');
            switchUtilityTab(targetTab);
        });
    });

    // Bind footer utility links to open the tabbed utility modal
    document.querySelectorAll('.link-f-utility').forEach(fLink => {
        fLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = fLink.getAttribute('data-tab');
            switchUtilityTab(targetTab);
            showModal('utilities-modal');
        });
    });

    // 1. Currency Conversion logic
    const inputNpr = document.getElementById('curr-npr-amount');
    const selectTarget = document.getElementById('curr-target-select');
    const resultValue = document.getElementById('curr-result-value');

    const runCurrencyConversion = () => {
        if (!inputNpr || !selectTarget || !resultValue) return;
        const nprVal = parseFloat(inputNpr.value) || 0;
        const selectedOpt = selectTarget.options[selectTarget.selectedIndex];
        const rate = parseFloat(selectedOpt.getAttribute('data-rate')) || 0;
        const code = selectTarget.value;
        const converted = (nprVal * rate).toFixed(2);
        
        // Format with comma separation
        const formatted = parseFloat(converted).toLocaleString('en-US', { minimumFractionDigits: 2 });
        resultValue.textContent = `${code} ${formatted}`;
    };

    inputNpr?.addEventListener('input', runCurrencyConversion);
    selectTarget?.addEventListener('change', runCurrencyConversion);

    // 2. Date Conversion logic (Approximate BS-AD converter)
    const btnConvertDate = document.getElementById('btn-convert-date');
    const bsYearIn = document.getElementById('date-bs-year');
    const bsMonthIn = document.getElementById('date-bs-month');
    const bsDayIn = document.getElementById('date-bs-day');
    const dateResult = document.getElementById('date-result-value');

    const nepaliMonths = ["Baisakh", "Jestha", "Asadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
    const englishMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    btnConvertDate?.addEventListener('click', () => {
        if (!bsYearIn || !bsMonthIn || !bsDayIn || !dateResult) return;
        const year = parseInt(bsYearIn.value);
        const monthIndex = parseInt(bsMonthIn.value) - 1;
        const day = parseInt(bsDayIn.value);

        // BS is ~56 years, 8 months, 17 days ahead of AD
        // A simple baseline approximation
        let adYear = year - 57;
        let adMonth = monthIndex + 4; // Baisakh (BS Month 1) starts in mid-April (AD Month 4)
        let adDay = day + 13; // Baisakh 1 is roughly April 14

        // Adjust calendar bounds
        if (adDay > 30) {
            adDay -= 30;
            adMonth += 1;
        }
        if (adMonth > 11) {
            adMonth -= 12;
            adYear += 1;
        }

        const formattedDay = adDay.toString().padStart(2, '0');
        dateResult.textContent = `${englishMonths[adMonth]} ${formattedDay}, ${adYear}`;
    });

    // 3. SOP Library logic
    const btnLoadSop = document.getElementById('btn-load-sop');
    const streamSelect = document.getElementById('sop-stream-select');
    const countrySelect = document.getElementById('sop-country-select');
    const previewTitle = document.getElementById('sop-preview-title');
    const previewText = document.getElementById('sop-preview-text');

    const sopBankData = {
        'it_australia': `Subject: Statement of Purpose (Genuine Student Requirement - GS)\n\nIntroduction: I, Mahesh Sharma, write this statement to express my genuine intent to pursue a Bachelor of Information Technology at [University Name], Australia.\n\nAcademic Background: I completed my 10+2 examinations in Science with a GPA of 3.2 from the National Examination Board (NEB) of Nepal. My academic performance demonstrates my capacity to digest advanced computational algorithms.\n\nWhy Australia: Unlike Nepal, Australia's TEQSA regulation guarantees quality delivery. Additionally, the Genuine Student checklist is transparent.\n\nCareer Plans: Post-completion, I plan to return to Kathmandu to join IT ventures like Logpoint or Deerhold as an assistant software engineer.`,
        'it_canada': `Study Plan for Canada Visa Officer:\n\nCourse: Post-Graduate Certificate in Software Development\n\n1. Rationale of Study: Having earned a Bachelor of Computer Science in Nepal, I realized that global platforms require DevOps skills which are not covered in my local university's curriculum.\n\n2. Choice of Institution: [College Name] has a robust applied research laboratory. The cooperative education semester will align my knowledge with North American standards.\n\n3. Tie to Home Country: My family operates a wholesale supply chain business in Lalitpur. I intend to build a customized ERP system for them upon my return.`,
        'it_usa': `Statement of Purpose for US F-1 Student Visa:\n\nProgram: Master of Science in Cybersecurity\n\nStatement: In an era of digital transformations, securing cloud servers is paramount. The US research infrastructure offers hands-on simulations in threat intelligence that are currently unavailable in my home country, Nepal.\n\nFuture Goals: After gaining practical skills via my Optional Practical Training (OPT), I will return to Nepal to consult for private banks (such as Nabil Bank) and the Ministry of Communication to improve security protocols.`,
        'business_australia': `Subject: Genuine Student Statement for Business Administration\n\nI wish to pursue my MBA at [Business School Name] in Sydney. This course provides key modules in organizational leadership and accounting. I intend to study in Australia to gain exposure to global business structures and return to Nepal to establish my own startup.`,
        'business_canada': `Study Plan: Global Business Management at [College Name]\n\nMy decision to study in Canada is rooted in the country's diverse workforce. The case-study methodology utilized in Canadian business programs will equip me with the analytical tools needed to lead international trade divisions back in Nepal.`,
        'business_usa': `Statement of Purpose for MBA Admissions:\n\nMy career goal is to transition from a technical developer to a product manager. An MBA in the United States, with its focus on venture capital and strategic negotiation, is the ideal catalyst for this career shift.`,
        'nursing_australia': `GTE/GS Statement: Bachelor of Nursing (Graduate Entry)\n\nNursing practice in Australia is highly regarded. By learning under the NMBA frameworks, I will master acute clinical nursing techniques, which I will bring back to assist tertiary hospitals in Kathmandu.`,
        'nursing_canada': `Study Plan: Practical Nursing Diploma\n\nI want to pursue nursing in Canada due to their emphasis on geriatric care. Nepal has an aging population, and the training I receive will help me design community health initiatives for senior citizens back home.`,
        'nursing_usa': `Statement of Purpose: Bachelor of Science in Nursing (BSN)\n\nMy ambition is to qualify as a registered nurse through US clinical placements. The high standard of simulation labs in the US will prepare me for advanced critical care work in hospital wards.`
    };

    btnLoadSop?.addEventListener('click', () => {
        if (!streamSelect || !countrySelect || !previewTitle || !previewText) return;
        const stream = streamSelect.value;
        const country = countrySelect.value;
        const key = `${stream}_${country}`;
        const text = sopBankData[key] || "Sample content is being updated. Check back shortly.";

        const streamText = streamSelect.options[streamSelect.selectedIndex].text;
        const countryText = countrySelect.options[countrySelect.selectedIndex].text;

        previewTitle.textContent = `Sample SOP: ${streamText} for ${countryText}`;
        previewText.textContent = text;
    });

    // 4. Score Equivalence calculation logic
    const ieltsInput = document.getElementById('score-ielts');
    const pteResult = document.getElementById('score-pte-result');
    const toeflResult = document.getElementById('score-toefl-result');

    const updateScoreEquivalents = () => {
        if (!ieltsInput || !pteResult || !toeflResult) return;
        const band = parseFloat(ieltsInput.value) || 0;

        let pteVal = "Under 30";
        let toeflVal = "Under 30";

        if (band >= 8.5) {
            pteVal = "86 - 90";
            toeflVal = "115 - 120";
        } else if (band >= 8.0) {
            pteVal = "80 - 85";
            toeflVal = "110 - 114";
        } else if (band >= 7.5) {
            pteVal = "73 - 79";
            toeflVal = "102 - 109";
        } else if (band >= 7.0) {
            pteVal = "65 - 72";
            toeflVal = "94 - 101";
        } else if (band >= 6.5) {
            pteVal = "58 - 64";
            toeflVal = "79 - 93";
        } else if (band >= 6.0) {
            pteVal = "50 - 57";
            toeflVal = "60 - 78";
        } else if (band >= 5.5) {
            pteVal = "42 - 49";
            toeflVal = "46 - 59";
        } else if (band >= 5.0) {
            pteVal = "36 - 41";
            toeflVal = "35 - 45";
        } else if (band >= 4.5) {
            pteVal = "30 - 35";
            toeflVal = "32 - 34";
        }

        pteResult.textContent = pteVal;
        toeflResult.textContent = toeflVal;
    };

    ieltsInput?.addEventListener('input', updateScoreEquivalents);


    /* ==========================================
       ENGLISH DIAGNOSTIC MOCK QUIZ LOGIC
       ========================================== */
    const quizForm = document.getElementById('english-diagnostic-quiz-form');
    const quizOverlayResult = document.getElementById('quiz-results-overlay');
    const quizScoreTxt = document.getElementById('quiz-band-score-txt');
    const quizResetBtn = document.getElementById('btn-reset-quiz');

    quizForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let score = 0;
        const q1Val = quizForm.elements['q1'].value;
        const q2Val = quizForm.elements['q2'].value;
        const q3Val = quizForm.elements['q3'].value;

        // Correct answers: Q1: B (for), Q2: A (scarce), Q3: B (because)
        if (q1Val === 'B') score++;
        if (q2Val === 'A') score++;
        if (q3Val === 'B') score++;

        let bandSuggestion = "";
        if (score === 3) {
            bandSuggestion = "Estimated IELTS: 7.5+ | PTE: 73+ (Excellent grammar and vocabulary!)";
        } else if (score === 2) {
            bandSuggestion = "Estimated IELTS: 6.5 | PTE: 58 (Good foundation, some prep needed.)";
        } else {
            bandSuggestion = "Estimated IELTS: 5.0 - 5.5 | PTE: 42 (We recommend starting with our intensive IELTS foundation course.)";
        }

        if (quizScoreTxt && quizOverlayResult) {
            quizScoreTxt.innerHTML = `${score} / 3 Correct.<br><strong>${bandSuggestion}</strong>`;
            quizOverlayResult.classList.remove('hidden');
        }
    });

    quizResetBtn?.addEventListener('click', () => {
        quizForm.reset();
        quizOverlayResult.classList.add('hidden');
    });


    /* ==========================================
       COUNSELOR & STUDENT PORTAL SIMULATED LOGIN
       ========================================== */
    const portalForm = document.getElementById('portal-login-form');
    const loginScreen = document.getElementById('counselor-login-form-screen');
    const dashboardScreen = document.getElementById('counselor-dashboard-screen');
    const dashboardTitle = document.getElementById('dashboard-user-title');
    const dashboardTable = document.querySelector('.dashboard-table-box');
    const logoutBtn = document.getElementById('btn-portal-logout');

    portalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim().toLowerCase();

        if (username === 'student') {
            // Student view
            dashboardTitle.textContent = "Student Portal";
            
            // Rewrite table content for student checklists
            dashboardTable.innerHTML = `
                <h4 style="margin: 15px 0 10px 0; font-size: 1rem;">My Document Checklist Status</h4>
                <table class="dash-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-color); text-align: left; background-color: var(--bg-light);">
                            <th style="padding: 8px;">Document Type</th>
                            <th style="padding: 8px;">File Status</th>
                            <th style="padding: 8px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">Passport Bio Page</td>
                            <td style="padding: 8px;"><span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Verified</span></td>
                            <td style="padding: 8px;"><i class="fa-solid fa-check"></i></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">IELTS TRF Scorecard</td>
                            <td style="padding: 8px;"><span style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Pending Review</span></td>
                            <td style="padding: 8px;"><button style="font-size: 0.75rem; padding: 2px 6px;">Re-upload</button></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">Academic Transcripts (12th)</td>
                            <td style="padding: 8px;"><span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Verified</span></td>
                            <td style="padding: 8px;"><i class="fa-solid fa-check"></i></td>
                        </tr>
                    </tbody>
                </table>
            `;
        } else {
            // Counselor view (default)
            dashboardTitle.textContent = "Counselor Portal Dashboard";
            
            // Restore default counselor table
            dashboardTable.innerHTML = `
                <h4 style="margin: 15px 0 10px 0; font-size: 1rem;">Recent Counseling Appointments</h4>
                <table class="dash-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-color); text-align: left; background-color: var(--bg-light);">
                            <th style="padding: 8px;">Student Name</th>
                            <th style="padding: 8px;">Target Country</th>
                            <th style="padding: 8px;">Branch</th>
                            <th style="padding: 8px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">Mahesh Sharma</td>
                            <td style="padding: 8px;">Australia</td>
                            <td style="padding: 8px;">Putalisadak</td>
                            <td style="padding: 8px;"><span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Approved</span></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">Pooja Shrestha</td>
                            <td style="padding: 8px;">Canada</td>
                            <td style="padding: 8px;">Lagankhel</td>
                            <td style="padding: 8px;"><span style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Pending</span></td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">Arjun Basnet</td>
                            <td style="padding: 8px;">USA</td>
                            <td style="padding: 8px;">Pokhara</td>
                            <td style="padding: 8px;"><span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Interview OK</span></td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        loginScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
    });

    logoutBtn?.addEventListener('click', () => {
        portalForm.reset();
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });


    /* ==========================================
       FOOTER NEWSLETTER FORM SUBMISSION
       ========================================== */
    const newsletterForm = document.getElementById('footer-newsletter-form');
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        const email = input ? input.value : "";
        
        // Show simulated subscription alert
        alert(`Thank you! ${email} has been subscribed to the Cambridge Institute newsletter.`);
        newsletterForm.reset();
    });

});
