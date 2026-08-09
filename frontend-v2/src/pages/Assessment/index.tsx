import { PageWrapper } from "../../components/layout/PageWrapper";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { Landing } from "./Landing";
import { QuestionEngine } from "./QuestionEngine";
import { Processing } from "./Processing";
import { Results } from "./Results";
import { AnimatePresence } from "framer-motion";

export const Assessment = () => {
  const { step } = useAssessmentStore();

  return (
    <PageWrapper>
      <div className="h-full w-full relative">
        <AnimatePresence mode="wait">
          {step === "landing" && <Landing key="landing" />}
          {step === "questions" && <QuestionEngine key="questions" />}
          {step === "processing" && <Processing key="processing" />}
          {step === "results" && <Results key="results" />}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};
