'use client'

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Book, GraduationCap, Calendar, FileText, Map } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from 'react';

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const dashboardItems = [
    {
      title: "Courses",
      description: "View and access courses.",
      icon: <Book className="h-8 w-8 text-white" />,
      link: "/student/courses"
    },
    {
      title: "Internships",
      description: "Find internship opportunities.",
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      link: "/student/internships"
    },
    {
      title: "Scheduled Meetings",
      description: "Check your upcoming meetings.",
      icon: <Calendar className="h-8 w-8 text-white" />,
      link: "/student/meetings"
    },
    {
      title: "Schemes",
      description: "Explore available schemes.",
      icon: <FileText className="h-8 w-8 text-white" />,
      link: "/student/schemes"
    },
    {
      title: "Roadmap",
      description: "Explore structured learning paths.",
      icon: <Map className="h-8 w-8 text-white" />,
      link: "/student/roadmap"
    }
  ]

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async (message: string) => {
    // Append the user message with a loading placeholder for the bot's response
    setMessages((prev) => [...prev, { user: message, bot: "..." }]);

    const url = 'https://open-ai21.p.rapidapi.com/chatgpt';
    const options = {
      method: 'POST',
      headers: {
        // Make sure this key is valid and your RapidAPI plan is active
        'x-rapidapi-key': 'd984697c89mshbe33dbe91ed22f1p149c7djsn93222271b3f9',
        'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        web_access: false
      })
    };

    try {
      const response = await fetch(url, options);
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Debug: log the raw response to confirm what the server is sending
      console.log("Bot raw response:", result);

      // If the API returns "status: true" but "result" is dots, 
      // the server is literally sending the dots.
      const botResponse = result.status
        ? result.result
        : "Sorry, I didn't understand that.";
      
      // Update the last message (the loading placeholder) with the actual bot response
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          user: message,
          bot: botResponse
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching response from chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to fetch response from the chatbot.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center gradient-background">
      <style>{`
        .gradient-background {
          background: linear-gradient(300deg, blue, #df3737, purple, yellow);
          background-size: 400% 400%;
          animation: gradient-animation 30s ease infinite;
        }
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glass-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .glass-box:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
      `}</style>
      
      <header className="absolute top-0 left-0 w-full bg-opacity-90 bg-blue-700 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">EDConnect</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700 border-transparent"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Welcome to Your Student Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {dashboardItems.map((item, index) => (
            <Card 
              key={index}
              className="glass-box transition duration-200 ease-in-out cursor-pointer text-white"
              onClick={() => navigate(item.link)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4 rounded-lg shadow-lg">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Chatbot Icon */}
      <div className="fixed bottom-4 right-4">
        <img 
          src="https://img.icons8.com/avantgarde/100/message-bot.png" 
          alt="Chatbot Icon" 
          className="h-12 w-12 cursor-pointer"
          onClick={handleChatToggle}
        />
      </div>

      {/* Chatbot UI */}
      <div className={`fixed bottom-16 right-4 bg-white shadow-lg rounded-lg p-4 ${isChatOpen ? "block" : "hidden"}`}>
        <h3 className="font-bold">Chatbot</h3>
        <div className="h-48 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p className="text-blue-600 font-semibold">You: {msg.user}</p>
              <p className="text-gray-600">Bot: {msg.bot}</p>
            </div>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="border rounded p-2 w-full" 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== "") {
              handleSendMessage(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }} 
        />
      </div>
    </div>
  )
}
