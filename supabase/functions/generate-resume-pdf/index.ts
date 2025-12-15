import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RESUME-PDF] ${step}${detailsStr}`);
};

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

interface ResumeRequest {
  resumeData: ResumeData;
  template: string;
  format: 'pdf' | 'docx';
}

function generateHTMLResume(data: ResumeData, template: string): string {
  const getTemplateStyles = (template: string) => {
    switch (template) {
      case 'modern':
        return {
          headerBg: '#3B82F6',
          accentColor: '#3B82F6',
          primaryColor: '#1F2937'
        };
      case 'minimal':
        return {
          headerBg: '#1F2937',
          accentColor: '#1F2937',
          primaryColor: '#374151'
        };
      case 'ats':
        return {
          headerBg: '#6B7280',
          accentColor: '#6B7280',
          primaryColor: '#111827'
        };
      default:
        return {
          headerBg: '#3B82F6',
          accentColor: '#3B82F6',
          primaryColor: '#1F2937'
        };
    }
  };

  const styles = getTemplateStyles(template);

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Resume - ${data.personalInfo.name}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.4; 
                color: #333;
                background: white;
                font-size: 11px;
            }
            .resume-container { 
                max-width: 210mm; 
                margin: 0 auto; 
                background: white;
                min-height: 297mm;
                padding: 15mm;
            }
            .header {
                background: ${styles.headerBg};
                color: white;
                padding: 20px;
                margin: -15mm -15mm 20px -15mm;
                text-align: left;
            }
            .header h1 { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 8px;
            }
            .header .contact-info { 
                font-size: 12px; 
                opacity: 0.9;
            }
            .section { margin-bottom: 20px; }
            .section-title {
                color: ${styles.accentColor};
                font-size: 14px;
                font-weight: bold;
                border-bottom: 1px solid #e5e5e5;
                padding-bottom: 4px;
                margin-bottom: 12px;
            }
            .experience-item, .education-item, .project-item {
                margin-bottom: 15px;
                page-break-inside: avoid;
            }
            .experience-header, .education-header, .project-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 5px;
            }
            .job-title, .degree-title, .project-title { 
                font-weight: bold; 
                color: ${styles.primaryColor};
                font-size: 12px;
            }
            .company, .institution { 
                color: #666; 
                font-size: 11px;
            }
            .date { 
                color: #888; 
                font-size: 10px; 
                white-space: nowrap;
            }
            .description { 
                color: #555; 
                margin-top: 5px;
                text-align: justify;
            }
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .skill-category {
                margin-bottom: 8px;
            }
            .skill-category-title {
                font-weight: bold;
                color: ${styles.primaryColor};
                margin-bottom: 4px;
            }
            .skill-items {
                color: #666;
                font-size: 10px;
            }
            .technologies {
                color: #888;
                font-size: 10px;
                margin-top: 3px;
            }
            .project-link {
                color: ${styles.accentColor};
                text-decoration: underline;
                font-size: 10px;
            }
            @media print {
                body { margin: 0; }
                .resume-container { 
                    padding: 10mm; 
                    margin: 0;
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="resume-container">
            <!-- Header -->
            <div class="header">
                <h1>${data.personalInfo.name || 'Your Name'}</h1>
                <div class="contact-info">
                    ${data.personalInfo.email || ''} 
                    ${data.personalInfo.phone ? ' • ' + data.personalInfo.phone : ''}
                    ${data.personalInfo.location ? ' • ' + data.personalInfo.location : ''}
                </div>
            </div>

            <!-- Professional Summary -->
            ${data.personalInfo.summary ? `
            <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="description">${data.personalInfo.summary}</div>
            </div>
            ` : ''}

            <!-- Experience -->
            ${data.experience.length > 0 ? `
            <div class="section">
                <div class="section-title">Work Experience</div>
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <div class="experience-header">
                            <div>
                                <div class="job-title">${exp.position}</div>
                                <div class="company">${exp.company}</div>
                            </div>
                            <div class="date">${exp.startDate} - ${exp.endDate}</div>
                        </div>
                        ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Education -->
            ${data.education.length > 0 ? `
            <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="education-item">
                        <div class="education-header">
                            <div>
                                <div class="degree-title">${edu.degree}</div>
                                <div class="institution">${edu.institution}</div>
                                ${edu.gpa ? `<div class="institution">GPA: ${edu.gpa}</div>` : ''}
                            </div>
                            <div class="date">${edu.startDate} - ${edu.endDate}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Skills -->
            ${data.skills.length > 0 ? `
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-grid">
                    ${data.skills.map(skill => `
                        <div class="skill-category">
                            <div class="skill-category-title">${skill.category}</div>
                            <div class="skill-items">${skill.items.join(' • ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Projects -->
            ${data.projects.length > 0 ? `
            <div class="section">
                <div class="section-title">Projects</div>
                ${data.projects.map(project => `
                    <div class="project-item">
                        <div class="project-header">
                            <div class="project-title">${project.name}</div>
                            ${project.link ? `<a href="${project.link}" class="project-link">${project.link}</a>` : ''}
                        </div>
                        ${project.description ? `<div class="description">${project.description}</div>` : ''}
                        ${project.technologies.length > 0 ? `<div class="technologies">Technologies: ${project.technologies.join(', ')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Resume PDF generation function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    const { resumeData, template, format }: ResumeRequest = await req.json();

    if (!resumeData) {
      throw new Error("Resume data is required");
    }

    logStep("Generating resume", { template, format });

    // Generate HTML resume
    const htmlContent = generateHTMLResume(resumeData, template || 'modern');

    if (format === 'pdf') {
      // For PDF generation, we'll return the HTML and let the frontend handle PDF conversion
      // This is a simplified approach - in production, you might want to use a service like Puppeteer
      return new Response(JSON.stringify({
        success: true,
        html: htmlContent,
        downloadUrl: `data:text/html;base64,${btoa(htmlContent)}`,
        message: "Resume HTML generated successfully. Use browser print-to-PDF for PDF conversion."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // For DOCX, return HTML that can be converted
      return new Response(JSON.stringify({
        success: true,
        html: htmlContent,
        message: "Resume generated successfully"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in generate-resume-pdf", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});