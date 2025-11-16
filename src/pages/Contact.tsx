import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with the developer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Send me a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="mailto:henrynjue255@gmail.com" className="text-primary hover:underline">
                  henrynjue255@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 mb-2 text-secondary" />
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>
                  Available 9AM-5PM EAT
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="https://wa.me/254757641234" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  +254 757 641234
                </a>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                📍 Based in Kirinyaga County, Kenya
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              "I'm actively seeking new opportunities, tech discussions, and open-source contributions."
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
