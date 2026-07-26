import { useAnalysis as useAnalysisContext } from '../context/AnalysisContext';

const useAnalysis = () => {
    return useAnalysisContext();
};

export default useAnalysis;
