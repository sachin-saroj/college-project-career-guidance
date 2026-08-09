import type { ResumeType } from "../../../schema/resumeSchema";
import { Mail, Phone, MapPin, Link, Globe } from "lucide-react";

export const ModernTemplate = ({ data }: { data: ResumeType }) => {
  const { personalInfo, education, experience, projects, skills, certificates, languages, achievements, hobbies } = data;
  const { themeColor, fontFamily } = data;

  return (
    <div style={{ fontFamily, color: "#1f2937" }} className="p-[40px] text-[10pt] leading-[1.5]">
      {/* Header */}
      <header className="mb-24 pb-16 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-[24pt] font-bold mb-8 uppercase tracking-wide text-gray-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-16 gap-y-4 text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-4">
              <Mail size={12} style={{ color: themeColor }} />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-4">
              <Phone size={12} style={{ color: themeColor }} />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-4">
              <MapPin size={12} style={{ color: themeColor }} />
              {personalInfo.location}
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-4">
              <Link size={12} style={{ color: themeColor }} />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-4">
              <Link size={12} style={{ color: themeColor }} />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-4">
              <Globe size={12} style={{ color: themeColor }} />
              {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-8 uppercase" style={{ color: themeColor }}>Professional Summary</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Experience</h2>
          <div className="flex flex-col gap-16">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-semibold text-gray-900 text-[12pt]">{exp.role}</h3>
                  <span className="text-gray-600 whitespace-nowrap">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                  </span>
                </div>
                <div className="font-medium text-gray-700 mb-8">{exp.company}</div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-wrap pl-16 border-l-2 border-gray-200">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Projects</h2>
          <div className="flex flex-col gap-16">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-semibold text-gray-900 text-[12pt]">{proj.name}</h3>
                  <div className="flex gap-8 text-gray-500 text-xs">
                    {proj.link && <a href={proj.link} className="hover:underline">Live Demo</a>}
                    {proj.github && <a href={proj.github} className="hover:underline">GitHub</a>}
                  </div>
                </div>
                {proj.description && (
                  <div className="text-gray-700 whitespace-pre-wrap mb-4">
                    {proj.description}
                  </div>
                )}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-gray-600 italic">
                    Technologies: {proj.techStack.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Education</h2>
          <div className="flex flex-col gap-12">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-600 whitespace-nowrap">
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate || "Present"}
                  </span>
                </div>
                <div className="text-gray-700">
                  {edu.institution} {edu.score && `| Score: ${edu.score}`}
                </div>
                {edu.description && (
                  <div className="text-gray-600 mt-4">{edu.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Skills</h2>
          <div className="flex flex-wrap gap-8">
            {skills.map((skill, i) => {
              const skillStr = typeof skill === 'string' ? skill : (skill as any).id || '';
              return (
                <span 
                  key={i} 
                  className="px-8 py-2 rounded-sm bg-gray-100 text-gray-800"
                >
                  {skillStr}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates && certificates.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Certifications</h2>
          <div className="flex flex-col gap-8">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  <span className="text-gray-600"> — {cert.issuer}</span>
                </div>
                {cert.date && <span className="text-gray-600 whitespace-nowrap">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Achievements</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4">
            {achievements.map((item, i) => {
              const str = typeof item === 'string' ? item : (item as any).id || '';
              return <li key={i}>{str}</li>;
            })}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Languages</h2>
          <div className="flex flex-wrap gap-8">
            {languages.map((lang, i) => {
              const str = typeof lang === 'string' ? lang : (lang as any).id || '';
              return (
                <span key={i} className="px-8 py-2 rounded-sm bg-gray-100 text-gray-800">{str}</span>
              );
            })}
          </div>
        </section>
      )}

      {/* Hobbies */}
      {hobbies && hobbies.length > 0 && (
        <section className="mb-24">
          <h2 className="text-[14pt] font-semibold mb-12 uppercase" style={{ color: themeColor }}>Hobbies & Interests</h2>
          <div className="text-gray-700">
            {hobbies.map((h) => {
              const str = typeof h === 'string' ? h : (h as any).id || '';
              return str;
            }).join(" • ")}
          </div>
        </section>
      )}
    </div>
  );
};
