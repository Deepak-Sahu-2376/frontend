
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import SEO from "../components/SEO";

export function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 9599271680", "+91 9350617158"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@deshrock.in", "support@deshrock.in"],
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["UG 27A Signum 36, Sector 36, Sohna", "Gurgaon, Haryana 122001"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        "Monday - Friday: 9:00 AM - 7:00 PM",
        "Saturday - Sunday: 10:00 AM - 5:00 PM",
      ],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 min-h-screen">
      <SEO
        title="Contact Us"
        description="Get in touch with DeshRock for any inquiries or support."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-10">
          <h2 className="text-4xl md:text-5xl font-normal mb-4 text-gray-900">Get In Touch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to start your real estate journey? Contact our expert team for
            personalized assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="bg-white shadow-lg rounded-2xl h-full">
            <CardContent className="p-8 space-y-6">
              <div className="mb-6">
                <h3 className="text-xl text-gray-900 font-medium">Send us a message</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <Input placeholder="John" className="bg-gray-50 border-gray-100 placeholder:text-gray-400 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Input placeholder="Doe" className="bg-gray-50 border-gray-100 placeholder:text-gray-400 focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="john.doe@example.com" className="bg-gray-50 border-gray-100 placeholder:text-gray-400 focus:bg-white transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <Input type="tel" placeholder="+91 98765 43210" className="bg-gray-50 border-gray-100 placeholder:text-gray-400 focus:bg-white transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <Input placeholder="Property inquiry" className="bg-gray-50 border-gray-100 placeholder:text-gray-400 focus:bg-white transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <Textarea placeholder="Tell us about your real estate needs..." className="min-h-32 bg-gray-50 border-gray-100 placeholder:text-gray-400 resize-none focus:bg-white transition-colors" />
              </div>

              <Button className="w-full bg-[#A17F5A] hover:bg-[#8e6f4e] text-white" size="lg">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-12 pl-0 lg:pl-12">
            <div>
              <h3 className="text-xl font-medium mb-8 text-gray-900">Contact Information</h3>
              <div className="space-y-8">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start group">
                      <div className="mr-6 flex-shrink-0 mt-1">
                        <Icon className="h-6 w-6 text-[#A17F5A]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 leading-relaxed">{detail}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;