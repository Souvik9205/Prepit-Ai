"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  FileVideo,
  Shield,
  Sparkles,
  Users,
  Video,
  Wand2,
  Brain,
  FileText,
  BarChart2,
  Fingerprint,
  Menu,
  X,
  ArrowRight,
  Globe,
  Mic,
  ChevronRight,
  Award,
  Hexagon,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const InterviewAI = () => {
  const [activeTab, setActiveTab] = useState("interviewers");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
  }) => (
    <motion.div variants={itemVariants}>
      <Card className="h-full border border-gray-200 group hover:border-transparent hover:shadow-2xl transition-all duration-300 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg"></div>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 group-hover:from-teal-500 group-hover:to-purple-600 transition-all duration-300">
              <Icon className="h-6 w-6 text-teal-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <CardTitle className="text-xl group-hover:text-teal-600 transition-colors duration-300">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );

  const Navbar = () => (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-8 w-8 rounded-lg mr-2 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <span
              className={`font-bold text-xl ${scrolled ? "text-gray-900" : "text-white"}`}
            >
              InterviewAI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`font-medium transition-all hover:text-teal-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-500 after:transition-all ${scrolled ? "text-gray-700" : "text-white after:bg-white"}`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`font-medium transition-all hover:text-teal-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-500 after:transition-all ${scrolled ? "text-gray-700" : "text-white after:bg-white"}`}
            >
              How It Works
            </a>
            <a
              href="#"
              className={`font-medium transition-all hover:text-teal-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-500 after:transition-all ${scrolled ? "text-gray-700" : "text-white after:bg-white"}`}
            >
              Pricing
            </a>
            <a
              href="#"
              className={`font-medium transition-all hover:text-teal-500 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-teal-500 after:transition-all ${scrolled ? "text-gray-700" : "text-white after:bg-white"}`}
            >
              Enterprise
            </a>
          </nav>

          {token ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/home">
                <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className={`transition-colors hover:-translate-y-1 duration-300 ${scrolled ? "text-gray-700 hover:text-teal-500" : "text-white hover:text-teal-300"}`}
                >
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X
                className={`h-6 w-6 ${scrolled ? "text-gray-900" : "text-white"}`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${scrolled ? "text-gray-900" : "text-white"}`}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a
                href="#features"
                className="font-medium text-gray-700 hover:text-teal-500 py-2 flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 text-teal-500" />
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-medium text-gray-700 hover:text-teal-500 py-2 flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 text-teal-500" />
                How It Works
              </a>
              <a
                href="#"
                className="font-medium text-gray-700 hover:text-teal-500 py-2 flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 text-teal-500" />
                Pricing
              </a>
              <a
                href="#"
                className="font-medium text-gray-700 hover:text-teal-500 py-2 flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 text-teal-500" />
                Enterprise
              </a>
              <div className="pt-2 flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-center hover:border-teal-500 hover:text-teal-500 transition-all duration-300"
                >
                  Log in
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-teal-800 to-purple-800 pt-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-full bg-grid-white/5"></div>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gray-50"
          style={{
            clipPath:
              "polygon(0 100%, 100% 100%, 100% 30%, 75% 70%, 50% 30%, 25% 70%, 0 30%)",
          }}
        ></motion.div>
        <div className="container mx-auto px-4 py-24 pt-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="px-4 py-1 rounded-full bg-white/10 text-teal-300 text-sm font-medium mb-6 inline-block backdrop-blur-sm">
                NEXT-GEN RECRUITMENT
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-300">
                  AI-Powered
                </span>{" "}
                Interview Platform
              </h1>
              <p className="text-xl text-gray-100 mb-8">
                Transform your hiring process with intelligent video interviews,
                comprehensive candidate analysis, and AI-driven evaluations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-lg border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  Start Free Trial{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg text-black/70 border-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                >
                  <Video className="mr-2 h-5 w-5 animate-pulse text-black/70" />{" "}
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-2 rounded-xl shadow-2xl">
                  <img
                    src="/api/placeholder/800/600"
                    alt="AI Interview Platform Dashboard"
                    className="rounded-lg w-full"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">
                      AI-Powered Analysis
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-teal-500 font-semibold mb-2 inline-block">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Advanced Interview Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers comprehensive tools for both interviewers and
              candidates
            </p>
          </motion.div>

          <Tabs
            defaultValue="interviewers"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-gray-100">
                <TabsTrigger
                  value="interviewers"
                  className="text-base py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  For Interviewers
                </TabsTrigger>
                <TabsTrigger
                  value="candidates"
                  className="text-base py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  For Candidates
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="interviewers">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={Shield}
                  title="Secure Authentication"
                  description="Multi-factor authentication and role-based access control to keep your interview data safe."
                />
                <FeatureCard
                  icon={Sparkles}
                  title="Customizable Templates"
                  description="Create interviews with multiple categories and topics tailored to your specific requirements."
                />
                <FeatureCard
                  icon={Wand2}
                  title="AI-Generated Questions"
                  description="Choose between hardcoded questions or let AI generate relevant questions based on the role."
                />
                <FeatureCard
                  icon={FileVideo}
                  title="Video Requirements"
                  description="Specify whether video is required or optional for your interview process."
                />
                <FeatureCard
                  icon={FileText}
                  title="Resume Integration"
                  description="Require resume uploads and automatically extract key information for personalized interviews."
                />
                <FeatureCard
                  icon={BarChart2}
                  title="Comprehensive Analytics"
                  description="View detailed evaluations on candidate performance, including confidence levels and response quality."
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="candidates">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={Brain}
                  title="Mock Interviews"
                  description="Practice with AI-powered mock interviews that simulate real interview conditions."
                />
                <FeatureCard
                  icon={CheckCircle}
                  title="Instant Feedback"
                  description="Receive immediate feedback on your responses, confidence, and presentation skills."
                />
                <FeatureCard
                  icon={Video}
                  title="Video Analysis"
                  description="Get insights on your facial expressions, body language, and emotional signals."
                />
                <FeatureCard
                  icon={Users}
                  title="User-Friendly Interface"
                  description="Easy-to-navigate platform with personalized interview links sent directly to your email."
                />
                <FeatureCard
                  icon={Fingerprint}
                  title="Privacy Controls"
                  description="Your data is secure and only shared with authorized interviewers."
                />
                <FeatureCard
                  icon={Award}
                  title="Performance Tracking"
                  description="Track your improvement over time with detailed performance metrics."
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 bg-gray-50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-teal-100 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-purple-100 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-teal-500 font-semibold mb-2 inline-block">
              THE PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform evaluates both video and audio to provide
              comprehensive insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-600 rounded-xl blur-lg opacity-30"></div>
                <img
                  src="/api/placeholder/700/500"
                  alt="AI Interview Analysis"
                  className="w-full rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-teal-300" />
                      <span className="font-semibold text-teal-300">
                        GLOBAL INSIGHTS
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold">Real-time Analysis</h3>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Advanced Evaluation Technology
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full p-3 h-12 w-12 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      Video Analysis
                    </h4>
                    <p className="text-gray-700">
                      Our AI tracks facial expressions and emotions to detect
                      confidence levels and ensure interview integrity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-3 h-12 w-12 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      Audio Evaluation
                    </h4>
                    <p className="text-gray-700">
                      We analyze speech patterns to evaluate response relevance,
                      confidence, speech clarity, and verbal behavior.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="bg-gradient-to-br from-teal-500 to-purple-500 rounded-full p-3 h-12 w-12 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <BarChart2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      Comprehensive Reports
                    </h4>
                    <p className="text-gray-700">
                      Interviewers receive detailed evaluation data highlighting
                      strengths and areas for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 via-purple-700 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDAgTCAwIDAgTCAwIDEwMCBMIDU2IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxLjUiPjwvcGF0aD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiPjwvcmVjdD48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1 rounded-full bg-white/10 text-teal-100 text-sm font-medium mb-6 inline-block backdrop-blur-sm">
              GET STARTED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Interview Process?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies using our AI-powered platform to find
              the best talent efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-teal-700 hover:bg-gray-100 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                Get Started Today{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Video className="mr-2 h-5 w-5 animate-pulse" /> Request Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4 group">
                <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-8 w-8 rounded-lg mr-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Hexagon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold group-hover:text-teal-400 transition-colors duration-300">
                  InterviewAI
                </h3>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewAI;
