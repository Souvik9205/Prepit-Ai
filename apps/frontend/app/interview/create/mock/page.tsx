"use client";
import React, { useState, useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Enums from your schema
enum QuestionType {
  HARDCODED = "HARDCODED",
  AI_GENERATED = "AI_GENERATED",
}
// Define the shape of a custom question
interface Question {
  question: string;
  order: number;
}

// Define the form values type
interface JobCreationValues {
  category: string;
  roles: string[];
  videoRequired: boolean;
  questionType: QuestionType;
  followUp: boolean;
  totalQuestions: number;
  resumeRequired: boolean;
  jobType: string;
  questions: Question[];
}

// Yup validation schema
const JobCreationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  roles: Yup.array()
    .of(Yup.string().required("Role is required"))
    .min(1, "At least one role is required"),
  questionType: Yup.string()
    .oneOf(Object.values(QuestionType), "Invalid question type")
    .required("Question type is required"),
  totalQuestions: Yup.number()
    .min(1, "Must have at least 1 question")
    .max(20, "Cannot have more than 20 questions")
    .required("Total questions is required"),
  questions: Yup.array().when("questionType", {
    is: QuestionType.HARDCODED,
    then: (schema) =>
      schema
        .of(
          Yup.object().shape({
            question: Yup.string().required("Question is required"),
            order: Yup.number().required("Order is required"),
          })
        )
        .test(
          "questions-count",
          "Number of questions cannot exceed total questions",
          function (questions) {
            const { totalQuestions } = this.parent;
            return !questions || questions.length <= totalQuestions;
          }
        ),
    otherwise: (schema) => schema,
  }),
});

const JobCreationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  // Initial form values
  const initialValues: JobCreationValues = {
    category: "",
    roles: [""],
    videoRequired: false,
    questionType: QuestionType.AI_GENERATED,
    followUp: true,
    totalQuestions: 5,
    resumeRequired: false,
    jobType: "JOB",
    questions: [],
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  // Handle form submission
  const handleSubmit = async (
    values: JobCreationValues,
    { setSubmitting, resetForm }: FormikHelpers<JobCreationValues>
  ) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Create job post first
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      const jobPostData = {
        category: values.category,
        roles: values.roles,
        videoRequired: values.videoRequired,
        questionType: values.questionType,
        followUp: values.followUp,
        totalQuestions: values.totalQuestions,
        resumeRequired: values.resumeRequired,
        jobType: values.jobType,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/job/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobPostData),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create job post");
      }

      const jobId = result.id || (result.job && result.job.id);
      if (!jobId) {
        console.error("Job ID not found in response:", result);
        throw new Error("Could not retrieve job ID from server response");
      }

      console.log("Using job ID:", jobId);

      // For hardcoded questions, add them to the job
      if (
        values.questionType === QuestionType.HARDCODED &&
        values.questions.length > 0
      ) {
        // Update order based on position in array
        const reorderedQuestions = values.questions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));

        const questionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/job/add-questions/${jobId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ questions: reorderedQuestions }),
          }
        );

        const questionResult = await questionResponse.json();

        if (!questionResponse.ok) {
          throw new Error(questionResult.message || "Failed to add questions");
        }
      }
      // Reset form after successful submission
      resetForm();
      setSuccessMessage("Job created successfully!");
    } catch (error) {
      console.error("Error creating job:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setErrorMessage(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Handle drag and drop reordering
  const onDragEnd = (result: any, formikValues: any, setFieldValue: any) => {
    if (!result.destination) return;

    const items = Array.from(formikValues.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property based on the new indices
    const reorderedItems = items.map((item, index) => ({
      ...(item as unknown as Question),
      order: index + 1,
    }));

    setFieldValue("questions", reorderedItems);
  };

  // Function to simulate AI question generation
  const generateAIQuestions = async (
    category: string,
    roles: string[],
    totalQuestions: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setIsGeneratingQuestions(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ai/generate-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            roles,
            totalQuestions,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate questions");
      }

      // Assuming the API returns an array of question objects
      const questions = result.questions || [];
      setGeneratedQuestions(questions);

      // For hardcoded mode, populate the questions field
      if (setFieldValue) {
        setFieldValue(
          "questions",
          questions.map((q: string, index: number) => ({
            question: q,
            order: index + 1,
          }))
        );
      }

      return questions;
    } catch (error) {
      console.error("Error generating questions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setErrorMessage(`Error: ${errorMessage}`);
      return [];
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Create New Job
      </motion.h1>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="mb-4 p-3 bg-green-100 text-green-700 rounded-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Formik<JobCreationValues>
        initialValues={initialValues}
        validationSchema={JobCreationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          validateForm,
        }) => {
          // Effect to validate when number of questions exceeds totalQuestions
          useEffect(() => {
            if (
              values.questionType === QuestionType.HARDCODED &&
              values.questions.length > values.totalQuestions
            ) {
              setFieldValue(
                "questions",
                values.questions.slice(0, values.totalQuestions)
              );
            }
            validateForm();
          }, [
            values.totalQuestions,
            values.questions.length,
            values.questionType,
          ]);

          return (
            <Form>
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Category Field */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category*
                  </label>
                  <Field
                    type="text"
                    name="category"
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Software Engineering, Marketing, etc."
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>

                {/* Roles Array */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roles*
                  </label>
                  <FieldArray name="roles">
                    {({ push, remove }) => (
                      <div>
                        <AnimatePresence>
                          {values.roles && values.roles.length > 0
                            ? values.roles.map((role, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-center mb-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Field
                                    name={`roles.${index}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter role"
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={values.roles.length === 1}
                                    className="ml-2 p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Remove
                                  </motion.button>
                                </motion.div>
                              ))
                            : null}
                        </AnimatePresence>
                        <motion.button
                          type="button"
                          onClick={() => push("")}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Add Role
                        </motion.button>
                        {errors.roles && touched.roles && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.roles as string}
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </motion.div>

                {/* Question Type */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="questionType"
                        value={QuestionType.AI_GENERATED}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">AI Generated</span>
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="questionType"
                        value={QuestionType.HARDCODED}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Custom Questions</span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="questionType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </motion.div>

                {/* Total Questions */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="totalQuestions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Questions
                  </label>
                  <Field
                    type="number"
                    name="totalQuestions"
                    id="totalQuestions"
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="totalQuestions"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  {values.questionType === QuestionType.HARDCODED &&
                    values.questions.length > values.totalQuestions && (
                      <div className="text-yellow-600 text-sm mt-1">
                        Only the first {values.totalQuestions} questions will be
                        used.
                      </div>
                    )}
                </motion.div>

                {/* Toggle Fields */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="videoRequired"
                      id="videoRequired"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="videoRequired"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Video Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="followUp"
                      id="followUp"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="followUp"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Enable Follow-up Questions
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="resumeRequired"
                      id="resumeRequired"
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="resumeRequired"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Resume Required
                    </label>
                  </div>
                </motion.div>

                {/* AI Generate Questions Button */}
                {values.questionType === QuestionType.HARDCODED && (
                  <motion.div
                    variants={itemVariants}
                    className="pt-2 pb-2 border-t"
                  >
                    <motion.button
                      type="button"
                      onClick={() =>
                        generateAIQuestions(
                          values.category,
                          values.roles,
                          values.totalQuestions,
                          setFieldValue
                        )
                      }
                      disabled={
                        isGeneratingQuestions ||
                        !values.category ||
                        !values.roles.length
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGeneratingQuestions ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </div>
                      ) : (
                        "Generate AI Questions"
                      )}
                    </motion.button>
                    <p className="text-sm text-gray-500 mt-1">
                      Generate AI questions as a starting point for your custom
                      questions.
                    </p>
                  </motion.div>
                )}

                {/* Custom Questions Section (Conditional) */}
                <AnimatePresence>
                  {values.questionType === QuestionType.HARDCODED && (
                    <motion.div
                      className="border-t pt-4 mt-4"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-medium">
                          Custom Questions
                        </h3>
                        <span className="text-sm text-gray-500">
                          {values.questions.length}/{values.totalQuestions}{" "}
                          questions
                        </span>
                      </div>

                      <FieldArray name="questions">
                        {({ push, remove }) => (
                          <div>
                            <AnimatePresence>
                              {values.questions.length === 0 && (
                                <motion.div
                                  className="text-gray-500 italic mb-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  No questions added yet. Click the button below
                                  to add questions or generate AI questions.
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {values.questions.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-blue-600 mb-2">
                                  Drag and drop to reorder questions
                                </p>
                                <DragDropContext
                                  onDragEnd={(result) =>
                                    onDragEnd(result, values, setFieldValue)
                                  }
                                >
                                  <Droppable droppableId="questions">
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {values.questions.map((_, index) => (
                                          <Draggable
                                            key={`question-${index}`}
                                            draggableId={`question-${index}`}
                                            index={index}
                                          >
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`mb-4 p-3 border rounded-md ${
                                                  snapshot.isDragging
                                                    ? "bg-blue-50 shadow-lg"
                                                    : "bg-gray-50"
                                                }`}
                                              >
                                                <div className="flex justify-between items-center mb-2">
                                                  <div
                                                    {...provided.dragHandleProps}
                                                    className="font-medium flex items-center cursor-grab"
                                                  >
                                                    <svg
                                                      className="w-5 h-5 mr-2 text-gray-500"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 8h16M4 16h16"
                                                      ></path>
                                                    </svg>
                                                    Question {index + 1}
                                                  </div>
                                                  <motion.button
                                                    type="button"
                                                    onClick={() =>
                                                      remove(index)
                                                    }
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                  >
                                                    Remove
                                                  </motion.button>
                                                </div>
                                                <div className="mb-2">
                                                  <Field
                                                    as="textarea"
                                                    name={`questions.${index}.question`}
                                                    placeholder="Enter your question"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    rows="3"
                                                  />
                                                  <ErrorMessage
                                                    name={`questions.${index}.question`}
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                  />
                                                </div>
                                                {/* Hidden order field - maintained by drag and drop */}
                                                <Field
                                                  type="hidden"
                                                  name={`questions.${index}.order`}
                                                  value={index + 1}
                                                />
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                              </div>
                            )}

                            <motion.button
                              type="button"
                              onClick={() =>
                                values.questions.length < values.totalQuestions
                                  ? push({
                                      question: "",
                                      order: values.questions.length + 1,
                                    })
                                  : null
                              }
                              disabled={
                                values.questions.length >= values.totalQuestions
                              }
                              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={
                                values.questions.length < values.totalQuestions
                                  ? { scale: 1.03 }
                                  : {}
                              }
                              whileTap={
                                values.questions.length < values.totalQuestions
                                  ? { scale: 0.97 }
                                  : {}
                              }
                            >
                              Add Question
                            </motion.button>
                            {values.questions.length >=
                              values.totalQuestions && (
                              <p className="text-sm text-yellow-600 mt-2">
                                Maximum number of questions reached. Increase
                                the total questions limit to add more.
                              </p>
                            )}
                            {errors.questions &&
                              typeof errors.questions === "string" &&
                              touched.questions && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.questions}
                                </div>
                              )}
                          </div>
                        )}
                      </FieldArray>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div className="pt-4" variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      "Create Job"
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </Form>
          );
        }}
      </Formik>
    </motion.div>
  );
};

export default JobCreationForm;
