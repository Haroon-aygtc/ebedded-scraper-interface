import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Edit,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the schema for follow-up questions and answer options
const answerOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, { message: "Answer text is required" }),
  response: z.string().min(1, { message: "Response is required" }),
});

const followUpQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, { message: "Question is required" }),
  answerOptions: z
    .array(answerOptionSchema)
    .min(1, { message: "At least one answer option is required" }),
});

const responseFormatSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  template: z.string().min(1, { message: "Template is required" }),
  followUpQuestions: z.array(followUpQuestionSchema).optional(),
});

type AnswerOption = z.infer<typeof answerOptionSchema>;
type FollowUpQuestion = z.infer<typeof followUpQuestionSchema>;
type ResponseFormat = z.infer<typeof responseFormatSchema>;

const AIResponseFormatter = () => {
  const [activeTab, setActiveTab] = useState("formats-list");
  const [formats, setFormats] = useState<ResponseFormat[]>([
    {
      id: "1",
      name: "Standard Response",
      description: "Basic response format with follow-up questions",
      template: "{{response}}\n\n{{followUpQuestions}}",
      followUpQuestions: [
        {
          id: "q1",
          question: "Would you like to know more about our services?",
          answerOptions: [
            {
              id: "a1",
              text: "Yes, tell me more",
              response: "We offer a wide range of services including...",
            },
            {
              id: "a2",
              text: "No, thanks",
              response:
                "No problem! Feel free to ask if you have any other questions.",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Technical Support",
      description: "Format for technical support responses",
      template:
        "I understand you're having an issue with {{issue}}. Here's how to resolve it: {{solution}}",
      followUpQuestions: [
        {
          id: "q2",
          question: "Did this solution resolve your issue?",
          answerOptions: [
            {
              id: "a3",
              text: "Yes, it worked!",
              response: "Great! I'm glad I could help.",
            },
            {
              id: "a4",
              text: "No, I'm still having problems",
              response:
                "I'm sorry to hear that. Let's try a different approach...",
            },
          ],
        },
      ],
    },
  ]);

  const [selectedFormat, setSelectedFormat] = useState<ResponseFormat | null>(
    null,
  );
  const [currentQuestion, setCurrentQuestion] =
    useState<FollowUpQuestion | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  // Add previewData state to fix the response is not defined error
  const [previewData, setPreviewData] = useState({
    response: "This is a sample AI response to demonstrate the formatting.",
    issue: "login problems",
    solution: "reset your password using the forgot password link",
    followUpQuestions:
      "Would you like to know more about security best practices?",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ResponseFormat>({
    resolver: zodResolver(responseFormatSchema),
    defaultValues: {
      name: "",
      description: "",
      template: "{{response}}\n\n{{followUpQuestions}}",
      followUpQuestions: [],
    },
  });

  const handleAddFormat = () => {
    setSelectedFormat(null);
    reset({
      name: "",
      description: "",
      template: "{{response}}\n\n{{followUpQuestions}}",
      followUpQuestions: [],
    });
    setActiveTab("format-editor");
  };

  const handleEditFormat = (format: ResponseFormat) => {
    setSelectedFormat(format);
    reset(format);
    setActiveTab("format-editor");
  };

  const handleDeleteFormat = (id: string) => {
    setFormats(formats.filter((format) => format.id !== id));
  };

  const onSubmit = (data: ResponseFormat) => {
    if (selectedFormat) {
      // Update existing format
      setFormats(
        formats.map((format) =>
          format.id === selectedFormat.id
            ? { ...data, id: selectedFormat.id }
            : format,
        ),
      );
    } else {
      // Add new format
      setFormats([...formats, { ...data, id: Date.now().toString() }]);
    }
    setActiveTab("formats-list");
  };

  const handleAddQuestion = () => {
    const newQuestion: FollowUpQuestion = {
      id: Date.now().toString(),
      question: "",
      answerOptions: [
        {
          id: Date.now().toString() + "-option",
          text: "",
          response: "",
        },
      ],
    };
    setCurrentQuestion(newQuestion);
    const currentQuestions = watch("followUpQuestions") || [];
    setValue("followUpQuestions", [...currentQuestions, newQuestion]);
    setShowAddQuestionDialog(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const currentQuestions = watch("followUpQuestions") || [];
    setValue(
      "followUpQuestions",
      currentQuestions.filter((q) => q.id !== questionId),
    );
  };

  const handleAddAnswerOption = (questionId: string) => {
    const currentQuestions = watch("followUpQuestions") || [];
    const updatedQuestions = currentQuestions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answerOptions: [
            ...q.answerOptions,
            {
              id: Date.now().toString(),
              text: "",
              response: "",
            },
          ],
        };
      }
      return q;
    });
    setValue("followUpQuestions", updatedQuestions);
  };

  const handleDeleteAnswerOption = (questionId: string, optionId: string) => {
    const currentQuestions = watch("followUpQuestions") || [];
    const updatedQuestions = currentQuestions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answerOptions: q.answerOptions.filter((opt) => opt.id !== optionId),
        };
      }
      return q;
    });
    setValue("followUpQuestions", updatedQuestions);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fix the renderPreview function to use previewData
  const renderPreview = (format: ResponseFormat) => {
    // Process the template with previewData
    const processedTemplate = format.template.replace(
      /{{(\w+)}}/g,
      (match, key) => {
        return previewData[key as keyof typeof previewData] || match;
      },
    );

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="whitespace-pre-wrap">{processedTemplate}</div>
        </div>

        {format.followUpQuestions && format.followUpQuestions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Follow-up Questions:</h3>
            {format.followUpQuestions.map((q) => (
              <div key={q.id} className="border rounded-md p-3">
                <div className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 text-blue-500" />
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {q.answerOptions.map((opt) => (
                        <Badge
                          key={opt.id}
                          variant="outline"
                          className="mr-2 mb-1"
                        >
                          {opt.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">AI Response Formatter</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="formats-list">Formats List</TabsTrigger>
          <TabsTrigger value="format-editor">Format Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview & Test</TabsTrigger>
        </TabsList>

        <TabsContent value="formats-list" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Response Formats</h2>
            <Button onClick={handleAddFormat}>
              <Plus className="mr-2 h-4 w-4" /> Add New Format
            </Button>
          </div>

          {formats.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No formats defined</AlertTitle>
              <AlertDescription>
                Create your first response format to start customizing AI
                responses.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formats.map((format) => (
                <Card key={format.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {format.name}
                        </CardTitle>
                        <CardDescription>{format.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFormat(format)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFormat(format.id || "")}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-md font-mono text-sm mb-4">
                      {format.template}
                    </div>
                    {format.followUpQuestions &&
                      format.followUpQuestions.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            Follow-up Questions:
                          </h3>
                          <div className="space-y-2">
                            {format.followUpQuestions.map((q) => (
                              <div key={q.id} className="border rounded-md p-3">
                                <p className="font-medium">{q.question}</p>
                                <div className="mt-2 space-y-1">
                                  {q.answerOptions.map((opt) => (
                                    <Badge
                                      key={opt.id}
                                      variant="outline"
                                      className="mr-2"
                                    >
                                      {opt.text}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedFormat(format);
                        setPreviewMode(true);
                        setActiveTab("preview");
                      }}
                    >
                      Preview & Test
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="format-editor">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedFormat
                  ? "Edit Response Format"
                  : "Create New Response Format"}
              </CardTitle>
              <CardDescription>
                Define how AI responses should be formatted and add follow-up
                questions.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Format Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="template">Response Template</Label>
                    <Textarea
                      id="template"
                      {...register("template")}
                      placeholder="{{response}}\n\n{{followUpQuestions}}"
                      className="font-mono"
                      rows={4}
                    />
                    {errors.template && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.template.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Use {{ response }} for the main AI response and{" "}
                      {{ followUpQuestions }} for follow-up questions.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label>Follow-up Questions</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddQuestionDialog(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Question
                    </Button>
                  </div>

                  {(watch("followUpQuestions") || []).length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">
                        No follow-up questions added yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {(watch("followUpQuestions") || []).map(
                        (question, qIndex) => (
                          <div
                            key={question.id}
                            className="border rounded-md p-4"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-2 w-full">
                                <Label htmlFor={`question-${qIndex}`}>
                                  Question
                                </Label>
                                <Input
                                  id={`question-${qIndex}`}
                                  {...register(
                                    `followUpQuestions.${qIndex}.question` as const,
                                  )}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteQuestion(question.id || "")
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <Label>Answer Options</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAddAnswerOption(question.id || "")
                                  }
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Option
                                </Button>
                              </div>

                              {question.answerOptions.length === 0 ? (
                                <div className="text-center py-4 border rounded-md">
                                  <p className="text-muted-foreground">
                                    No answer options added yet
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {question.answerOptions.map(
                                    (option, oIndex) => (
                                      <div
                                        key={option.id}
                                        className="border rounded-md p-3"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="space-y-2 w-full">
                                            <Label
                                              htmlFor={`option-${qIndex}-${oIndex}`}
                                            >
                                              Option Text
                                            </Label>
                                            <Input
                                              id={`option-${qIndex}-${oIndex}`}
                                              {...register(
                                                `followUpQuestions.${qIndex}.answerOptions.${oIndex}.text` as const,
                                              )}
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              handleDeleteAnswerOption(
                                                question.id || "",
                                                option.id || "",
                                              )
                                            }
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>

                                        <div className="mt-2">
                                          <Label
                                            htmlFor={`response-${qIndex}-${oIndex}`}
                                          >
                                            Response
                                          </Label>
                                          <Textarea
                                            id={`response-${qIndex}-${oIndex}`}
                                            {...register(
                                              `followUpQuestions.${qIndex}.answerOptions.${oIndex}.response` as const,
                                            )}
                                            rows={3}
                                          />
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("formats-list")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {selectedFormat ? "Update Format" : "Create Format"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview & Test</CardTitle>
              <CardDescription>
                Preview how your response format will look with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Format</h3>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {formats.map((format) => (
                        <div
                          key={format.id}
                          className={`p-3 border rounded-md cursor-pointer ${selectedFormat?.id === format.id ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setSelectedFormat(format)}
                        >
                          <h4 className="font-medium">{format.name}</h4>
                          <p className="text-sm text-gray-500">
                            {format.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  {selectedFormat ? (
                    <div>
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(selectedFormat.template)}
                          className="gap-1"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" /> Copy Template
                            </>
                          )}
                        </Button>
                      </div>
                      {renderPreview(selectedFormat)}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] border rounded-md">
                      <p className="text-gray-500">
                        Select a format to preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Question Dialog */}
      <Dialog
        open={showAddQuestionDialog}
        onOpenChange={setShowAddQuestionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up Question</DialogTitle>
            <DialogDescription>
              Add a new follow-up question with answer options
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="new-question">Question</Label>
              <Input
                id="new-question"
                placeholder="e.g., Would you like to know more about our services?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddQuestionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIResponseFormatter;
