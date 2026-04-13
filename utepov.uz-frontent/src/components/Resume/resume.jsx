import React, { useEffect, useState } from "react";
import { Download, Printer, Calendar, MapPin, Award, BookOpen, Briefcase, Globe, Mail, Phone, User, GraduationCap, Code, Shield } from "lucide-react";
import "./ResumePage.scss";

const ResumePage = () => {
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Show download button after scroll
    const handleScroll = () => {
      setShowDownload(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const fileUrl = "/resume.docx"; // Sizning word file manzilingiz
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "Qilichov_Akobir_Resume.docx"; // Yuklab olinadigan fayl nomi
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const personalInfo = [
    { icon: <Calendar size={18} />, label: "Tug'ilgan yili", value: "08.08.1986" },
    { icon: <MapPin size={18} />, label: "Tug'ilgan joyi", value: "Buxoro viloyati" },
    { icon: <User size={18} />, label: "Millati", value: "o'zbek" },
    { icon: <Award size={18} />, label: "Partiyaviyligi", value: "yo'q" },
    { icon: <GraduationCap size={18} />, label: "Ma'lumoti", value: "oliy" },
  ];

  const education = [
    { year: "2014", degree: "Bakalavr", institution: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy Universiteti" },
    { year: "2016", degree: "Magistratura", institution: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy Universiteti" },
  ];

  const specialties = [
    { icon: <Code size={18} />, name: "Analitik matematika va informatika" },
    { icon: <Shield size={18} />, name: "Kriptografiya va kriptoanaliz" },
  ];

  const workExperience = [
    { year: "2010–2014", title: "Talaba (bakalavr)", organization: "O'zbekiston Milliy Universiteti" },
    { year: "2014–2016", title: "Talaba (magistr)", organization: "O'zbekiston Milliy Universiteti" },
    { year: "2017–2020", title: "Akademik bo'lim inspektori", organization: "Jahon iqtisodiyoti va diplomatiya universiteti" },
    { year: "2020–2023", title: "Matematika o'qituvchisi", organization: "Muhammad al-Xorazmiy nomidagi ixtisoslashtirilgan maktab" },
    { year: "2021–2023", title: "Bosh mutaxassis (0.5 stavka)", organization: "Ixtisoslashtirilgan ta'lim muassasalari agentligi" },
    { year: "2023 — hozirgacha", title: "Test sinovlarini raqamlashtirish va tahlil etish bo'limi boshlig'i", organization: "Pedagogik mahorat va xalqaro baholash ilmiy-amaliy markazi", current: true },
  ];

  const skills = [
    { name: "Matematik tahlil", level: 95 },
    { name: "Python dasturlash", level: 85 },
    { name: "Ma'lumotlar tahlili", level: 90 },
    { name: "Kriptografiya", level: 75 },
    { name: "Ingliz tili", level: 70 },
    { name: "Rus tili", level: 85 },
  ];

  return (
    <div className="resume-page">
      {/* Action buttons */}


      <div className="resume">
        <div className="resume__card">
          {/* Header with gradient background */}
          <header className="resume__header">
            <div className="resume__header-content">
              <div className="resume__badge">RASMIY MA'LUMOTNOMA</div>
              <h1 className="resume__name">Utepov Sanjar Shomuratovich</h1>

              <div className="resume__position-badge">
                <Briefcase size={20} />
                <p className="resume__position">
                  2023-yil 5-sentabrdan — Test sinovi jarayonlarini raqamlashtirish
                  hamda tahlil etish bo‘limi boshlig‘i
                </p>
              </div>

              <p className="resume__organization">
                Ixtisoslashtirilgan ta’lim muassasalari agentligi huzuridagi
                Pedagogik mahorat va xalqaro baholash ilmiy-amaliy markazi
              </p>
            </div>

            <div className="resume__photo-wrapper">
              <div className="resume__photo-frame">
                <img
                  src="/logo2.png"
                  alt="Utepov Sanjar Shomuratovich"
                  className="resume__photo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150x180?text=Photo";
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>
          </header>

          {/* Personal Info Cards */}
          <section className="resume__section">
            <div className="section-header">
              <User size={22} />
              <h3 className="resume__section-title">Shaxsiy ma'lumotlar</h3>
            </div>
            <div className="info-cards">
              {personalInfo.map((item, index) => (
                <div key={index} className="info-card">
                  <div className="info-card-icon">{item.icon}</div>
                  <div className="info-card-content">
                    <span className="info-card-label">{item.label}</span>
                    <span className="info-card-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="resume__section">
            <div className="section-header">
              <GraduationCap size={22} />
              <h3 className="resume__section-title">Ta'lim</h3>
            </div>
            <div className="education-timeline">
              {education.map((item, index) => (
                <div key={index} className="education-item">
                  <div className="education-year">{item.year}</div>
                  <div className="education-content">
                    <div className="education-degree">{item.degree}</div>
                    <div className="education-institution">{item.institution}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Two columns section */}
          <div className="resume__two-columns">
            {/* Specialties */}
            <section className="resume__section">
              <div className="section-header">
                <Code size={22} />
                <h3 className="resume__section-title">Mutaxassisligi</h3>
              </div>
              <div className="specialties-list">
                {specialties.map((item, index) => (
                  <div key={index} className="specialty-item">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages & Science */}
            <section className="resume__section">
              <div className="section-header">
                <Globe size={22} />
                <h3 className="resume__section-title">Ilmiy va tillar</h3>
              </div>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Ilmiy darajasi:</span>
                  <span className="info-value">yo'q</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ilmiy unvoni:</span>
                  <span className="info-value">yo'q</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Chet tillari:</span>
                  <span className="info-value">rus va ingliz tillari</span>
                </div>
              </div>

              {/* Skills progress */}
              <div className="skills-section">
                <h4 className="skills-title">Ko'nikmalar</h4>
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Additional Info */}
          <section className="resume__section">
            <div className="section-header">
              <Award size={22} />
              <h3 className="resume__section-title">Qo'shimcha ma'lumotlar</h3>
            </div>
            <div className="info-list horizontal">
              <div className="info-row">
                <span className="info-label">Davlat mukofotlari:</span>
                <span className="info-value">yo'q</span>
              </div>
              <div className="info-row">
                <span className="info-label">Deputatlik yoki boshqa a'zolik:</span>
                <span className="info-value">yo'q</span>
              </div>
            </div>
          </section>

          {/* Work Experience Timeline */}
          <section className="resume__section">
            <div className="section-header">
              <Briefcase size={22} />
              <h3 className="resume__section-title">Mehnat faoliyati</h3>
            </div>
            <div className="timeline">
              {workExperience.map((item, index) => (
                <div key={index} className={`timeline-item ${item.current ? 'current' : ''}`}>
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    {index !== workExperience.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-year">
                      {item.year}
                      {item.current && <span className="current-badge">Hozirgi</span>}
                    </div>
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-organization">{item.organization}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;