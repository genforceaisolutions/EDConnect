import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Schemes() {
  const schemes = [
    {
      title: "Pradhan Mantri Vidya Lakshmi Karyakram",
      description: "A single-window platform for students to apply for multiple bank loans.",
      link: "https://www.vidyalakshmi.co.in/"
    },
    {
      title: "Central Sector Interest Subsidy (CSIS) Scheme",
      description: "Interest subsidy on education loans for students from economically weaker sections.",
      link: "https://www.education.gov.in/scholarships-education-loan"
    },
    {
      title: "NSFDC Educational Loan Scheme",
      description: "Loans for SC students pursuing professional or technical courses.",
      link: "https://nsfdc.nic.in/en/educational-loan-scheme"
    },
    {
      title: "Padho Pardesh Scheme",
      description: "Interest subsidy for minority students pursuing higher education abroad.",
      link: "https://www.studentcover.in/government-schemes-to-help-students-with-education-loans-in-india"
    },
    {
      title: "Dr. Ambedkar Central Sector Scheme",
      description: "Interest subsidy for OBC/EBC students studying abroad.",
      link: "https://www.studentcover.in/government-schemes-to-help-students-with-education-loans-in-india"
    },
    {
      title: "Baroda Vidya",
      description: "Education loan for school education from Nursery to XII.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-vidya"
    },
    {
      title: "Baroda Gyan",
      description: "Loan for Indian students pursuing graduation, post-graduation, or professional courses.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-gyan"
    },
    {
      title: "Baroda Scholar",
      description: "Loan for students admitted to MBA, MCA, MS, and other notified courses abroad.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-scholar"
    },
    {
      title: "Skill Loan Scheme",
      description: "Loan designed for students pursuing technical courses.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan"
    },
    {
      title: "Baroda Digital Education Loan",
      description: "Assistance in financing digital education needs.",
      link: "https://www.bankofbaroda.in/personal-banking/loans/education-loan/baroda-digital-education-loan"
    }
  ];

  return (
    <div className="min-h-screen schemes-background">
      <style >{`
        .schemes-background {
          background: linear-gradient(90deg, rgba(173,216,230,1) 0%, rgba(100,149,237,1) 50%, rgba(70,130,180,1) 100%);
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }
      `}</style>
      
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Government Loan Schemes</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => (
            <Card
              key={index}
              className="glass-box hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => window.open(scheme.link, "_blank")}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{scheme.title}</h3>
                  <p className="text-gray-700">{scheme.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}