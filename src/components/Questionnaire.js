import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Pagination,
  Tooltip,
  InputBase,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
  ListAlt as ListAltIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import CheckboxQuestion from "./CheckboxQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ScaleQuestion from "./ScaleQuestion";
import TextQuestion from "./TextQuestion";
import GridQuestion from "./GridQuestion";
import AssistantIcon from "@mui/icons-material/Assistant";
import { getQByQID, saveAndNext, saveAnswer } from "../api";
import {
  jwtStore,
  gridStore,
  answerStore,
  solnStore,
  scoreStore,
  qTitleStore,
  mapStore,
} from "../redux/store";
import {
  useNavigate,
  useSearchParams,
  useParams,
  Link,
} from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./styles.css";
import InfoIcon from "@mui/icons-material/Info";
import CheckboxGridQuestion from "./CheckboxGrid";
import CommonComponent from "./CommonComponent";
import { fontSize, lineHeight, style, textAlign } from "@mui/system";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import ChatBot from "./ChatBot";
import { mapQuestions } from "../utils/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Questionnaire = () => {
  const [currentQuestion, setcurrentQuestion] = useState(0);
  const [completedSections, setCompletedSections] = useState(0);
  const [intervals, setIntervals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sectionHeaders, setSectionHeaders] = useState([]);
  const [currentQID, setCurrentQID] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedResults, setSelectedResults] = useState([]);
  const [references, setReferences] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReferenceTableOpen, setIsReferenceTableOpen] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pdfSearchQuery, setPdfSearchQuery] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [searchSummary, setSearchSummary] = useState([]);
  const [pdfSuggestions, setPdfSuggestions] = useState([]);
  const [selectedPdfTexts, setSelectedPdfTexts] = useState([]);
  const [questionReferences, setQuestionReferences] = useState([]);
  const [currentSection, setCurrentSection] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageTitle, setPageTitle] = useState("");
  const [answerObject, setAnswerObject] = useState("");
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);
  const API_KEY = "AIzaSyCtqidSRsI2NhNP-vQrx1Ixq0gQHcH_eUM";
  const CX = "60cbe814015d24004";
  const [showCommonComponent, setShowCommonComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReferenceTableInView, setIsReferenceTableInView] = useState(true);
  const referenceTableRef = useRef(null);
  const [dropdownQuestions, setDropdownQuestions] = useState([
    "What is the capital of France?",
    "How does photosynthesis work?",
    "Who invented the telephone?",
    "What are the symptoms of COVID-19?",
    "How to bake chocolate chip cookies?",
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questionBubbles = [
    "What is the capital of France?",
    "How does photosynthesis work?",
    "Who invented the telephone?",
    "What are the symptoms of COVID-19?",
    "How to bake chocolate chip cookies?",
    "What is the theory of relativity?",
    "How do vaccines work?",
    "What are the main causes of climate change?",
    "Who wrote 'Romeo and Juliet'?",
    "What is the process of mitosis?",
    "How does a computer's CPU function?",
    "What are the major events of World War II?",
    "How do electric cars work?",
    "What is the significance of the Mona Lisa?",
    "How does the human digestive system work?",
    "What are the key principles of democracy?",
    "How do earthquakes occur?",
    "What is artificial intelligence?",
    "Who was Marie Curie and what did she discover?",
    "How does the stock market work?",
  ];

  const handleBubbleSelect = (question) => {
    setSelectedQuestion(question);
    setSearchQuery(question); // Set the search query to the selected question
    handleSearch(1, question);
  };

  const handleDeselectQuestion = () => {
    setSelectedQuestion(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReferenceTableInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (referenceTableRef.current) {
      observer.observe(referenceTableRef.current);
    }

    return () => {
      if (referenceTableRef.current) {
        observer.unobserve(referenceTableRef.current);
      }
    };
  }, []);

  const typemap = {
    MULTIPLE_CHOICE: MultipleChoiceQuestion,
    GRID: GridQuestion,
    CHECKBOX_GRID: CheckboxGridQuestion,
    PAGE_BREAK: TextQuestion,
    TEXT: TextQuestion,
    SECTION_HEADER: TextQuestion,
    SCALE: ScaleQuestion,
    CHECKBOX: CheckboxQuestion,
    PARAGRAPH_TEXT: TextQuestion,
  };

  function handleError(message) {
    setError(true);
    setErrorMessage(message);
  }

  function handleClose() {
    setError(false);
    setErrorMessage("");
  }

  const handleDropdownSelect = (event) => {
    const selectedQuestion = event.target.value;
    setSearchQuery(selectedQuestion);
    handleSearch(1, selectedQuestion);
  };

  const handleNext = () => {
    setIsLoading(true);
    saveCurrentReferences();
    save({
      answer_id: currentQID,
      answer_object: answerObject,
      position: currentQuestion + 1,
    });
  };

  const handleCommonNext = () => {
    setShowCommonComponent(false);
    if (currentQuestion < questions.length - 1) {
      setcurrentQuestion(currentQuestion + 1);
      setCompletedSections(completedSections + 1);
      loadReferencesForQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    saveCurrentReferences();
    if (currentQuestion > 0) {
      setcurrentQuestion(currentQuestion - 1);
      loadReferencesForQuestion(currentQuestion - 1);
      //    setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    saveCurrentReferences();
    setCompletedSections(completedSections + 1);
    setOpenDialog(true);

    save({
      answer_id: currentQID,
      answer_object: answerObject,
      position: currentQuestion + 1,
    });
  };

  const handleSaveAndExit = () => {
    setOpenDialog(true);
  };
  let [searchParamss] = useSearchParams();

  const handleCloseDialog = () => {
    if (currentQuestion + 1 !== questions.length) {
      navigate("/");
    } else {
      setSubmitted(true);
      // window.open(
      //   `/report?id=${searchParams.get("id")}`,
      //   "_blank",
      //   "rel=noopener noreferrer"
      // );
      navigate(`/report?qid=${searchParamss.get("id")}`);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsPdfOpen(false);
  };

  const togglePdfUpload = () => {
    setIsPdfOpen(!isPdfOpen);
    setIsSearchOpen(false);
  };

  const toggleReferenceTable = () => {
    setIsReferenceTableOpen(!isReferenceTableOpen);
    setIsSearchOpen(false);
    setIsPdfOpen(false);
  };

  const handleSearch = async (page = 1, query = searchQuery) => {
    if (query.trim() === "") return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: API_KEY,
            cx: CX,
            q: query,
            start: (page - 1) * 10 + 1,
          },
        }
      );
      setSearchResults(response.data.items || []);
      setCurrentPage(page);
      setTotalPages(
        Math.ceil(response.data.searchInformation.totalResults / 10)
      );
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(1);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleResultSelect = (index) => {
    const selected = [...selectedResults];
    const resultIndex = selected.indexOf(index);
    if (resultIndex > -1) {
      selected.splice(resultIndex, 1);
    } else {
      selected.push(index);
    }
    setSelectedResults(selected);

    const updatedReferences = [
      ...selected.map((idx) => ({
        type: "search",
        sn: idx + 1,
        title: searchResults[idx].title,
        snippet: searchResults[idx].snippet,
        link: searchResults[idx].link,
      })),
      ...selectedPdfTexts.map((result, idx) => ({
        type: "pdf",
        sn: selected.length + idx + 1,
        title: `Page ${result.page}`,
        snippet: result.text,
        link: pdfFile,
      })),
    ];
    setReferences(updatedReferences);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(URL.createObjectURL(file));
      setIsPdfOpen(true);
      setIsSearchOpen(false);
      setIsReferenceTableOpen(false);
      setSearchSummary([]);
    }
  };

  const handlePdfClose = () => {
    setIsPdfOpen(false);
    setPdfFile(null);
    setPdfSearchQuery("");
    setSearchSummary([]);
    fileInputRef.current.value = "";
  };

  const handlePdfSearch = async (query) => {
    setPdfSearchQuery(query);
    const pdf = await pdfjs.getDocument(pdfFile).promise;
    const searchSummary = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items;
      let pageResults = [];
      textItems.forEach((item, itemIndex) => {
        if (item.str.toLowerCase().includes(query.toLowerCase())) {
          pageResults.push({ text: item.str, page: pageNum, index: itemIndex });
        }
      });
      if (pageResults.length > 0) {
        searchSummary.push(...pageResults);
      }
    }
    setSearchSummary(searchSummary);
  };

  const handlePdfTextSelect = (text) => {
    const selected = [...selectedPdfTexts];
    const index = selected.findIndex(
      (item) => item.page === text.page && item.text === text.text
    );

    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(text);
    }

    setSelectedPdfTexts(selected);

    const updatedReferences = [
      ...selectedResults.map((idx) => ({
        type: "search",
        sn: idx + 1,
        title: searchResults[idx].title,
        snippet: searchResults[idx].snippet,
        link: searchResults[idx].link,
      })),
      ...selected.map((result, idx) => ({
        type: "pdf",
        sn: selectedResults.length + idx + 1,
        title: `Page ${result.page}`,
        snippet: result.text,
        link: pdfFile,
      })),
    ];

    setReferences(updatedReferences);
  };

  const saveCurrentReferences = () => {
    const updatedQuestionReferences = [...questionReferences];
    updatedQuestionReferences[currentQuestion] = references;
    setQuestionReferences(updatedQuestionReferences);
  };

  const loadReferencesForQuestion = (questionIndex) => {
    const refs = questionReferences[questionIndex] || [];
    setReferences(refs);
    setSelectedResults(
      refs.filter((ref) => ref.type === "search").map((ref) => ref.sn - 1)
    );
    setSelectedPdfTexts(
      refs
        .filter((ref) => ref.type === "pdf")
        .map((ref) => ({
          text: ref.snippet,
          page: parseInt(ref.title.split(" ")[1]),
        }))
    );
  };

  const generateJsonOutput = () => {
    return questions.map((question, index) => ({
      question: question.itemTitle,
      references: questionReferences[index] || [],
    }));
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const questionStyles = {
    backgroundColor: "white",
    color: "#4D4556",
    textAlign: "center",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "10px",
    marginBottom: "20px",
    fontFamily: "DM Sans, sans-serif",
    transition: "all 10s ease",
  };

  const optionStyles = {
    color: "#A4A1A0",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "DM Sans, sans-serif",
  };

  const questionTextStyles = {
    color: "#4D4556",
    fontWeight: "bold",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1.25vw",
  };
  const descStyles = {
    color: "#4D4556",
    fontSize: "18px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "montserrat, sans-serif",
  };

  const progressBarContainerStyles = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40px",
    display: "flex",
    backgroundColor: "white",
    overflow: "hidden",
    transition: "all 1s ease",
  };

  const progressBarSegmentStyles = {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    position: "relative",
    zIndex: 1,
    fontFamily: "DM Sans, sans-serif",
  };

  const progressFillStyles = {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    transition: "width 0.3s ease",
    backgroundColor: "#1EC8DF",
    zIndex: 0,
  };

  const referenceTableStyles = {
    backgroundColor: "white",
    color: "#A4A1A0",
    padding: "20px",
    borderRadius: "16px",
    marginTop: "15px",
    width: "90%",
    height: "calc(100% - 100px)",
    overflowY: "auto",
    fontFamily: "DM Sans, sans-serif",
  };

  const referenceTableHeaderStyles = {
    color: "#A6A4A3",
    fontWeight: "bold",
    fontSize: "24px",
    marginBottom: "10px",
    marginTop: "30px",
    textAlign: "center",
    fontFamily: "Montserrat, sans-serif",
  };

  const menuIconStyles = {
    backgroundColor: "#E5FFFC",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    transition: "background-color 0.3s ease",
  };

  const searchContainerStyles = {
    backgroundColor: "white",
    color: "#A4A1A0",
    borderRadius: "20px",
    marginTop: "25px",
    width: "90%",
    height: "calc(100% - 100px)",
    overflowY: "auto",
    fontFamily: "DM Sans, sans-serif",
  };

  const getQ = async (id, jwt) => {
    try {
      let res = await getQByQID(id, jwt);

      if (res && res.form && res.data) {
        let breaks = 1;

        setPageTitle(res.form.title);

        let secHeaders = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type === "SECTION_HEADER") {
            let ques = res.data[i];
            ques.start = i - breaks;
            secHeaders.push(ques);
          }
          breaks++;
        }
        setSectionHeaders(secHeaders);
        setQuestions(res.data);
        setIntervals(breaks);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  jwtStore.subscribe(() => {
    setJwt(jwtStore.getState());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id && jwt) {
        await getQ(id, jwt);
      } else {
        console.error("Missing required parameters: id or jwt");
      }
    };

    if (jwt !== "") {
      fetchData();
    }
  }, [jwt]);

  answerStore.subscribe(() => {
    setAnswerObject(answerStore.getState());
  });

  const save = async (payload) => {
    let res = await saveAnswer(searchParams.get("id"), jwt, payload);
    if (res.status === "ok") {
      gridStore.dispatch({
        type: "grid",
        payload: {
          options: [],
          columns: [],
        },
      });
      scoreStore.dispatch({
        type: "scores",
        payload: res.model.scores,
      });
      if (currentQuestion < questions.length - 1) {
        if (questions[currentQuestion + 1].type === "SECTION_HEADER") {
          setShowCommonComponent(true);
        } else {
          setcurrentQuestion(currentQuestion + 1);
          setCompletedSections(completedSections + 1);
          loadReferencesForQuestion(currentQuestion + 1);
        }
      } else {
        saveCurrentReferences();
        setCompletedSections(completedSections + 1);
        setOpenDialog(true);
      }
      setIsLoading(false);
    } else {
      handleError("This field is required");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length !== 0) {
      if (!mapQuestions.includes(questions[currentQuestion].itemTitle)) {
        solnStore.dispatch({
          type: "solution",
          payload: questions[currentQuestion].answers,
        });
      } else {
        answerStore.dispatch({
          type: "answer_object",
          payload: {},
        });
      }
      qTitleStore.dispatch({
        type: "Section",
        payload: questions[currentQuestion].itemTitle,
      });
      setCurrentQID(questions[currentQuestion].id);
      if (
        questions[currentQuestion].type === "GRID" ||
        questions[currentQuestion].type === "CHECKBOX_GRID"
      ) {
        gridStore.dispatch({
          type: "grid",
          payload: {
            options: JSON.parse(questions[currentQuestion].columns),
            columns: Object.keys(JSON.parse(questions[currentQuestion].rows)),
          },
        });
      }

      let ques = questions[currentQuestion];
      if (ques.type === "SECTION_HEADER") {
        setCurrentSection(ques.itemTitle);

        setSectionDesc(ques.description);
        setcurrentQuestion(currentQuestion + 1);
      } else if (ques.type === "PAGE_BREAK") {
        setcurrentQuestion(currentQuestion + 1);
      }
    }
  }, [currentQuestion, questions]);

  jwtStore.subscribe(() => {
    setJwt(jwtStore.getState());
  });

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setJwt(localStorage.getItem("jwt"));
      jwtStore.dispatch({
        type: "jwt",
        payload: localStorage.getItem("jwt"),
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "white",
        color: "#A4A1A0",
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "DM Sans, sans-serif",
        transition: "all 10s ease",
      }}
    >
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      {showCommonComponent ? (
        <div>
          <div
            style={{
              position: "absolute",
              top: "5vh",
              right: "5vw",
            }}
          >
            <Tooltip title="Save and Exit" arrow>
              <Button
                variant="text"
                color="primary"
                onClick={handleSaveAndExit}
                className="glow-on-hover"
                style={{
                  color: "#4D4556",
                  backgroundColor: "transparent",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "0.3s",
                }}
                startIcon={
                  <CloseIcon
                    style={{
                      fontSize: 30,
                      marginRight: "-5px",
                    }}
                  />
                }
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#FF2C5F";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#4D4556";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              ></Button>
            </Tooltip>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>
                Questionnaire{" "}
                {questions.length - 1 == currentQuestion
                  ? "submitted"
                  : "Saved"}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Your answers have been successfully submitted!
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  style={{
                    backgroundColor: "#1EC8DF",
                    color: "white",
                  }}
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <CommonComponent
            handleNext={handleCommonNext}
            section={currentSection}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              width: "33%",
              backgroundColor: "#E5FFFC",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              overflow: "hidden",
              fontFamily: "DM Sans, sans-serif",
              borderRadius: "40px",
              position: "fixed",
              top: "100px",
              left: "20px",
            }}
          >
            {isSearchOpen && (
              <div style={searchContainerStyles}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  <div className="search-panels">
                    <div className="search-group">
                      <input
                        required
                        type="text"
                        name="text"
                        autoComplete="on"
                        className="input"
                        value={searchQuery}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <label className="enter-label">Search</label>
                      <div className="btn-box">
                        <button
                          className="btn-search"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch(1);
                          }}
                          onClick={() => handleSearch(1)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                          >
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            <circle
                              id="svg-circle"
                              cx="208"
                              cy="208"
                              r="144"
                            ></circle>
                          </svg>
                        </button>
                      </div>
                      <div className="btn-box-x">
                        <button className="btn-cleare" onClick={handleClear}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 384 512"
                          >
                            <path
                              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                              id="cleare-line"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {selectedQuestion ? (
                      <div
                        className="selected-bubble-container"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px",
                          marginBottom: "20px",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#e5fffc",
                            borderRadius: "20px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: "10px" }}>
                            {selectedQuestion}
                          </span>
                          <button
                            onClick={handleDeselectQuestion}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="bubble-container"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: "10px",
                          marginTop: "10px",
                          marginBottom: "20px",
                          width: "100%",
                          padding: "0 15px",
                        }}
                      >
                        {questionBubbles.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleBubbleSelect(question)}
                            style={{
                              backgroundColor: "#e5fffc",
                              border: "none",
                              borderRadius: "20px",
                              padding: "10px 15px",
                              fontSize: "14px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              flex:
                                question.length < 30
                                  ? "0 0 calc(50% - 5px)"
                                  : "0 0 100%",
                              marginBottom: "10px",
                              textAlign: "left",
                            }}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* <select
                      onChange={handleDropdownSelect}
                      style={{
                        width: "90%",
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      <option value="">Select a question</option>
                      {dropdownQuestions.map((question, index) => (
                        <option key={index} value={question}>
                          {question}
                        </option>
                      ))}
                    </select> */}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "0 20px",
                    overflowY: "auto",
                    height: "80%",
                  }}
                >
                  {searchResults.map((result, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <FormControlLabel
                        control={
                          // <Checkbox
                          // checked={selectedResults.includes(index)}
                          // onChange={() => handleResultSelect(index)}
                          // />
                          <label
                            className="checkbox-container"
                            checked={selectedResults.includes(index)}
                            onChange={() => handleResultSelect(index)}
                          >
                            <input type="checkbox" />
                            <svg
                              viewBox="0 0 64 64"
                              height="1.5em"
                              width="1.5em"
                              marginRight="10px"
                            >
                              <path
                                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                pathLength="575.0541381835938"
                                className="path"
                              ></path>
                            </svg>
                          </label>
                        }
                        label={
                          <div>
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#4D4556",
                                textDecoration: "none",
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{ color: "#4D4556" }}
                              >
                                {result.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ color: "grey" }}
                              >
                                {result.snippet}
                              </Typography>
                            </a>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => handleSearch(page)}
                    style={{ margin: "20px 0" }}
                  />
                )}
              </div>
            )}
            {isPdfOpen && (
              <>
                <div style={searchContainerStyles}>
                  <ChatBot isPdfOpen={isPdfOpen} />
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "90%",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePdfSearch(pdfSearchQuery);
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search in PDF..."
                      inputProps={{ "aria-label": "search in pdf" }}
                      value={pdfSearchQuery}
                      onChange={(e) => setPdfSearchQuery(e.target.value)}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={() => handlePdfSearch(pdfSearchQuery)}
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="close"
                      onClick={handlePdfClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Paper>
                </div>
                <div
                  style={{
                    width: "100%",
                    padding: "0 20px",
                    height: "calc(100% - 60px)",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      height: "calc(100vh - 200px)",
                      overflowY: "auto",
                      width: "100%",
                    }}
                  >
                    <div>
                      {searchSummary.map((result, index) => (
                        <div
                          key={index}
                          style={{ marginBottom: "10px", color: "#4D4556" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedPdfTexts.some(
                                  (item) =>
                                    item.page === result.page &&
                                    item.text === result.text
                                )}
                                onChange={() => handlePdfTextSelect(result)}
                              />
                            }
                            label={
                              <Typography variant="body2">
                                Page {result.page}: {result.text}
                              </Typography>
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <Document
                      file={pdfFile}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      onLoadError={console.error}
                      renderMode="canvas"
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={
                            pdfContainerRef.current
                              ? pdfContainerRef.current.offsetWidth
                              : 600
                          }
                        />
                      ))}
                    </Document>
                  </div>
                </div> */}
              </>
            )}
          </div>
          <div
            className="max-w-5xl mx-auto"
            style={{
              flex: "1",
              backgroundColor: "2A2A2A",
              overflowY: "auto",
              height: "100vh",
              padding: "20px",
              maxWidth: "60vw",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 10s ease",
              marginLeft: "33%",
            }}
          >
            <Typography
              variant="h6"
              className="text-white text-center mb-8"
              style={{
                fontFamily: "DM Sans, sans-serif",
                marginTop: "55px",
                color: "#2A2A2A",
                fontWeight: "bold",
              }}
            >
              {currentSection !== "" && (
                <Tooltip
                  title={
                    <Typography
                      variant="body2"
                      style={{ fontSize: "36", color: "black" }}
                    >
                      {sectionDesc}
                    </Typography>
                  }
                  arrow
                >
                  <IconButton>
                    <InfoIcon sx={{ color: "black" }} />
                  </IconButton>
                </Tooltip>
              )}
              {currentSection}
            </Typography>
            <div style={questionStyles}>
              <Typography variant="h4" style={{ ...questionTextStyles }}>
                {questions.length === 0
                  ? ""
                  : questions[currentQuestion].itemTitle}
              </Typography>
              <Typography variant="h1" style={{ ...descStyles }}>
                {questions.length === 0
                  ? ""
                  : questions[currentQuestion].description}
              </Typography>
              <div
                style={{
                  transition: "all 1s ease",
                  maxWidth:
                    questions.length !== 0 &&
                    (questions[currentQuestion].type === "GRID" ||
                      questions[currentQuestion].type === "CHECKBOX_GRID")
                      ? "90vw"
                      : "100%",
                }}
              >
                {questions.length !== 0 &&
                  React.createElement(
                    typemap[questions[currentQuestion].type],
                    {
                      options:
                        questions[currentQuestion].type === "MULTIPLE_CHOICE" ||
                        questions[currentQuestion].type === "CHECKBOX"
                          ? Object.keys(
                              JSON.parse(questions[currentQuestion].choices)
                            )
                          : [],
                      minLabel:
                        questions[currentQuestion].type === "SCALE"
                          ? JSON.parse(questions[currentQuestion].bounds)[0]
                              .label
                          : "",
                      maxLabel:
                        questions[currentQuestion].type === "SCALE"
                          ? JSON.parse(questions[currentQuestion].bounds)[1]
                              .label
                          : "",
                      optionStyles: optionStyles,
                    }
                  )}
              </div>

              {isReferenceTableOpen && (
                <Box sx={{ width: "100%" }} ref={referenceTableRef}>
                  <Typography variant="h4" style={referenceTableHeaderStyles}>
                    References for this question
                  </Typography>
                  <Paper sx={{ width: "100%", mb: 2 }}>
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 800 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell width={"400px"}>Search Result</TableCell>
                            <TableCell width={"650px"}>Preview Text</TableCell>
                            <TableCell>Link</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {references.map((reference, index) => (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={index}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#ffffff" : "#e5fffc",
                              }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedResults.includes(index)}
                                  onChange={() => handleResultSelect(index)}
                                  sx={{
                                    color: "#1976d2",
                                    "&.Mui-checked": {
                                      color: "#1976d2",
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                {reference.title}
                              </TableCell>
                              <TableCell>{reference.snippet}</TableCell>
                              <TableCell>
                                <a
                                  href={reference.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "blue",
                                    textDecoration: "none",
                                  }}
                                >
                                  {reference.link}
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              )}

              {!isReferenceTableInView && isReferenceTableOpen && (
                <button
                  className="button-scroll"
                  onClick={() =>
                    referenceTableRef.current.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <svg className="svgIcon" viewBox="0 0 384 512">
                    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                  </svg>
                </button>
              )}
              {currentQuestion < questions.length - 1 ? (
                // <Button
                //   variant="contained"
                //   onClick={handleNext}
                //   className=""
                //   style={{
                //     backgroundColor: "#449082",
                //     color: "white",
                //     marginTop: "20px",
                //     width: "200px",
                //     height: "40px",
                //     fontSize: "16px",
                //     display: "block",
                //     margin: "20px auto 40px auto",
                //     border: "1px solid #449082",
                //     fontFamily: "DM Sans, sans-serif",
                //     boxShadow: "none",
                //   }}
                // >
                //   Next
                // </Button>
                <button
                  className="next-button"
                  variant="contained"
                  onClick={handleNext}
                  style={{
                    marginBottom: "30px",
                  }}
                  disabled={isLoading}
                >
                  <span className="label">Next</span>
                  {isLoading ? (
                    <span className="loader"></span>
                  ) : (
                    <span className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        ></path>
                      </svg>
                    </span>
                  )}
                </button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  className="icon-slide-right"
                  style={{
                    backgroundColor: "#449082",
                    color: "white",
                    marginTop: "20px",
                    width: "200px",
                    height: "40px",
                    fontSize: "16px",
                    display: "block",
                    margin: "20px auto 40px auto",
                    border: "1px solid #449082",
                    fontFamily: "DM Sans, sans-serif",
                    boxShadow: "none",
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
            <div style={progressBarContainerStyles}>
              <div
                style={{
                  ...progressFillStyles,
                  width: `${progressPercentage}%`,
                }}
              ></div>
              <div
                style={{
                  ...progressBarSegmentStyles,
                  color: "#2A2A2A",
                  opacity: 1,
                }}
              >
                {currentSection !== "" && (
                  <Tooltip
                    title={
                      <Typography
                        variant="body2"
                        style={{ fontSize: "36", color: "black" }}
                      >
                        {sectionDesc}
                      </Typography>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoIcon sx={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                )}
                {currentSection}
              </div>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>
                Questionnaire{" "}
                {questions.length - 1 == currentQuestion
                  ? "submitted"
                  : "Saved"}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Your answers have been successfully submitted!
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  style={{
                    backgroundColor: "#1EC8DF",
                    color: "white",
                  }}
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Button
              variant="text"
              color="primary"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="glow-on-hover"
              style={{
                color: "#4D4556",
                top: "-5px",
                fontFamily: "DM Sans, sans-serif",
                transition: "0.3sec",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#2B675C";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#4D4556";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Tooltip title="Back">
                <ArrowBackIcon style={{ fontSize: 32 }} />
              </Tooltip>
            </Button> */}
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
            >
              <div className="bg-[#e5fffc] rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#000000"
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  ></path>
                  <path
                    fill="#000000"
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  ></path>
                </svg>
              </div>
              <p className="translate-x-2" style={{ fontFamily: "Montserrat" }}>
                Go Back
              </p>
            </button>
            <div className="flex flex-row bg-[#e5fffc] w-fit px-0 py-0 shadow-box-up rounded-2xl dark:bg-box-dark dark:shadow-box-dark-out">
              <div className="dark:shadow-buttons-box-dark rounded-2xl w-full px-1.5 py-1.5 md:px-3 md:py-3">
                {/* <Tooltip title="Open Search">
                  <a
                    className="cursor-pointer text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed  hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                    onClick={toggleSearchBar}
                  >
                    <SearchIcon className="w-5 h-5" />
                  </a>
                </Tooltip> */}
                <section className=" inline-flex justify-center items-center">
                  <button
                    onClick={toggleSearchBar}
                    className="flex group justify-center p-2 rounded-md drop-shadow-xl bg-gradient-to-r  text-black font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500"
                  >
                    <SearchIcon className="w-5 h-5" />
                    <span className="absolute text-xs opacity-0 group-hover:opacity-100 group-hover:text-gray-400 group-hover:text-xs group-hover:-translate-y-6 duration-700">
                      Search
                    </span>
                  </button>
                </section>
                {/* <Tooltip title="AI Assistant">
                  <a
                    className="cursor-pointer text-light-blue-light hover:text-black dark:text-gray-400 border-2 inline-flex items-center mr-4 last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:active:bg-button-curved-pressed-dark dark:active:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
                    onClick={() => {
                      togglePdfUpload();
                    }}
                  >
                    <AssistantIcon className="w-5 h-5" />
                  </a>
                </Tooltip> */}
                <section className=" inline-flex justify-center items-center">
                  <button
                    onClick={() => {
                      togglePdfUpload();
                    }}
                    className="flex group justify-center p-2 rounded-md drop-shadow-xl bg-gradient-to-r  text-black font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500"
                  >
                    <AssistantIcon className="w-5 h-5" />
                    <span className="absolute text-xs opacity-0 group-hover:opacity-100 group-hover:text-gray-400 group-hover:text-xs group-hover:-translate-y-6 duration-700">
                      Assistant
                    </span>
                  </button>
                </section>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* <Tooltip title="Save and Exit" arrow>
              <Button
                variant="text"
                color="primary"
                onClick={handleSaveAndExit}
                className="glow-on-hover"
                style={{
                  color: "#4D4556",
                  backgroundColor: "transparent",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "0.3s",
                }}
                startIcon={
                  <CloseIcon
                    style={{
                      fontSize: 30,
                      marginRight: "-5px",
                    }}
                  />
                }
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#FF2C5F";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#4D4556";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              ></Button>
            </Tooltip> */}
            {/* <button
              className="relative border-2 border-black group hover:border-[#e5fffc] w-12 h-12 duration-500 overflow-hidden rounded-full"
              type="button"
              onClick={handleSaveAndExit}
              startIcon={
                <CloseIcon
                  style={{
                    fontSize: 30,
                    marginRight: "-5px",
                  }}
                />
              }
            >
              <p
                className="font-Manrope text-3xl h-full w-full flex items-center justify-center text-black duration-500 relative z-10 group-hover:scale-0"
              >
                ×
              </p>
              <span
                className="absolute w-full h-full bg-[#b1ffe8] rotate-45 group-hover:top-9 duration-500 top-12 left-0"
              ></span>
              <span
                className="absolute w-full h-full bg-[#b1ffe8] rotate-45 top-0 group-hover:left-9 duration-500 left-12"
              ></span>
              <span
                className="absolute w-full h-full bg-[#b1ffe8] rotate-45 top-0 group-hover:right-9 duration-500 right-12"
              ></span>
              <span
                className="absolute w-full h-full bg-[#b1ffe8] rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"
              ></span>
            </button> */}
            <button
              className="cssbuttons-io-button text-black text-xl font-semibold"
              onClick={handleSaveAndExit}
              style={{
                fontFamily: "Montserrat",
                fontWeight: "600",
              }}
            >
              Close
              <div className="icon">X</div>
            </button>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
};

export default Questionnaire;
