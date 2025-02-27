"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  VideoIcon,
  Wand2,
  Brain,
  FileText,
  Menu,
  X,
  ArrowRight,
  Zap,
  Plus,
  Briefcase,
  Calendar,
} from "lucide-react";
import Link from "next/link";

const InterviewAIHome = () => {
  const [token, setToken] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      window.location.href = "/auth/login";
    }
  }, []);

  // Check scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch job data from API
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/job/get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }

        const result = await response.json();
        setJobData(result.jobs || []);
        console.log("Job data fetched:", result);
      } catch (err) {
        console.error("Error fetching job data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInterviewData();
    }
  }, [token]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get days ago
  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Animation variants
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-teal-800 to-purple-800 pt-12 pb-4">
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
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Welcome to your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-300 cursor-pointer hover:from-teal-400 hover:to-purple-400">
                  Interview Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
                Create, manage and analyze your interviews all in one place.
                Start with a mock test for practice or create a job test for
                your candidates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/interview/create/mock">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-purple-600 cursor-pointer hover:scale-105 duration-300 transition-transform hover:from-teal-600 hover:to-purple-700 text-lg border-none"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Create Mock Test
                  </Button>
                </Link>
                <Link href="/interview/create/job">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg text-black/60 cursor-pointer hover:scale-105 duration-300 transition-transform hover:bg-white border-white hover:bg-white/10"
                  >
                    <Briefcase className="mr-2 h-5 w-5" /> Create Job Test
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section id="dashboard" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-teal-500 font-semibold mb-2 inline-block">
              YOUR DASHBOARD
            </span>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Interview Statistics
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mock Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-teal-600">12</p>
                <CardDescription>4 completed this month</CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Job Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {jobData.length}
                </p>
                <CardDescription>
                  {isLoading ? "Loading..." : "Recently created"}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-teal-600">85%</p>
                <CardDescription>+5% from last week</CardDescription>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Interview Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">42min</p>
                <CardDescription>Average duration</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Recent Tests Section */}
      <section id="tests" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="text-teal-500 font-semibold mb-2 inline-block">
                RECENT ACTIVITY
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Your Tests</h2>
            </div>
            <div className="flex gap-4">
              <Link href="/interview/create/job">
                <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white border-none">
                  <Plus className="mr-2 h-5 w-5" /> New Test
                </Button>
              </Link>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading job tests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading job tests: {error}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Mock Test Card - Keep one static example */}
              <motion.div variants={itemVariants}>
                <Card className="h-full border border-gray-200 hover:border-teal-500 hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-teal-500" />
                        <CardTitle className="text-xl">
                          Frontend Dev Mock
                        </CardTitle>
                      </div>
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
                        Mock Test
                      </span>
                    </div>
                    <CardDescription>Created 2 days ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Questions</span>
                        <span className="font-medium">10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">45 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Score</span>
                        <span className="font-medium text-teal-600">82%</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Continue Practice{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Job Test Cards from API */}
              {jobData.slice(0, 5).map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="h-full border border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-purple-500" />
                          <CardTitle className="text-xl">
                            {job.category}
                          </CardTitle>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          Job Test
                        </span>
                      </div>
                      <CardDescription>
                        Created {getDaysAgo(job.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Roles</span>
                          <span className="font-medium">
                            {job.roles.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Questions</span>
                          <span className="font-medium">
                            {job.totalQuestions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Video Required</span>
                          <span className="font-medium">
                            {job.videoRequired ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {job.roles.map((role, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        <Link href={`/interview/job/${job.id}`}>
                          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {jobData.length > 5 && (
            <div className="text-center mt-10">
              <Link href="/interview/jobs">
                <Button
                  variant="ghost"
                  className="text-teal-600 hover:text-teal-700"
                >
                  View All Tests ({jobData.length}){" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 via-purple-700 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Create a new test or analyze your interview performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/interview/create/mock">
              <Button
                size="lg"
                className="h-auto py-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
              >
                <div className="flex flex-col items-center text-center">
                  <Brain className="h-8 w-8 mb-3" />
                  <span className="text-lg font-medium">Create Mock Test</span>
                  <span className="text-sm mt-1 text-gray-200">
                    Practice interviews
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/interview/create/job">
              <Button
                size="lg"
                className="h-auto py-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
              >
                <div className="flex flex-col items-center text-center">
                  <Briefcase className="h-8 w-8 mb-3" />
                  <span className="text-lg font-medium">Create Job Test</span>
                  <span className="text-sm mt-1 text-gray-200">
                    For candidates
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/reports">
              <Button
                size="lg"
                className="h-auto py-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
              >
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-8 w-8 mb-3" />
                  <span className="text-lg font-medium">View Reports</span>
                  <span className="text-sm mt-1 text-gray-200">
                    Performance analysis
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/interview/feedback">
              <Button
                size="lg"
                className="h-auto py-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
              >
                <div className="flex flex-col items-center text-center">
                  <Wand2 className="h-8 w-8 mb-3" />
                  <span className="text-lg font-medium">AI Feedback</span>
                  <span className="text-sm mt-1 text-gray-200">
                    Interview improvement
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-8 w-8 rounded-lg mr-2 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-lg font-semibold">
                InterviewAI
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-teal-400 transition-colors">
                Help
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p>
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewAIHome;
