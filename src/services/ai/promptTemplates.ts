import { PromptTemplate } from "../../types/ai";

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  financial: {
    name: "Financial Report",
    description:
      "A comprehensive summary format for financial reports and analysis.",
    template: `Analyze the uploaded financial reports provided by various brokerage and investment research firms. Generate a concise, investor-focused summary that offers a high-level assessment of the investment opportunity. The summary should enable investors to quickly decide whether to delve into the full report. Include the following sections:
              1. Key Takeaways & Market Outlook
              * Main Insights: Summarise the core messages of the report.
              * Market Sentiment: Identify whether the overall tone is bullish, bearish, or neutral.
              * Macroeconomic Impact: Note any significant economic or industry-wide factors affecting the outlook.
              2. Investment Opportunity & Stock Rating
              * Analyst Ratings: Detail the brokerage's rating (e.g., Buy, Hold, Sell, Overweight, Underweight).
              * Price Targets: Present the price target and compare it to the current market price.
              * Bullish/Bearish Arguments: Highlight the key reasons supporting the rating.
              3. Financial & Valuation Highlights
              * Financial Metrics: Summarise critical data points such as revenue growth, earnings forecasts, profit margins, debt levels, and cash flow trends.
              * Valuation Measures: Include valuation ratios like P/E, EV/EBITDA, and any DCF assessments along with peer comparisons.
              * Recent Updates: Note any significant revisions in estimates, dividend changes, or earnings surprises.
              4. Risk Factors & Challenges
              * Primary Risks: Identify major risks mentioned in the report (e.g., regulatory, competitive, economic).
              * Threat Analysis: Assess any potential external factors that could adversely impact the company or sector.
              5. Analyst Insights & Future Catalysts
              * Key Catalysts: Outline upcoming events or triggers (e.g., earnings releases, product launches, regulatory decisions) that could influence the stock.
              * Industry Trends: Comment on any broader trends that might affect future performance.
              6. Actionable Investment Summary
              * Opportunity Assessment: Provide a clear judgment on whether the investment appears attractive.
              * Entry/Exit Strategies: Suggest potential entry or exit points and risk management strategies if applicable.
              * Next Steps: Offer a brief directive encouraging investors to review the full report for a deeper understanding.
              Ensure that the summary is clear, data-driven, and unbiased, emphasising critical decision-making factors from an investment standpoint. If additional clarifications are needed, ask pertinent questions before finalising the summary.`,
    customizable: true,
  },
  academic: {
    name: "Academic Paper",
    description:
      "A summary format suitable for academic papers and research articles.",
    template: `Analyze the academic content and provide a summary with these sections:
    1. Research Overview
    * Research Question/Hypothesis
    * Methodology
    * Key Findings

    2. Literature Review
    * Theoretical Framework
    * Previous Research
    * Knowledge Gaps

    3. Methodology Analysis
    * Research Design
    * Data Collection
    * Analysis Methods

    4. Results & Discussion
    * Key Findings
    * Statistical Significance
    * Implications

    5. Conclusions
    * Research Contribution
    * Limitations
    * Future Research Directions`,
    customizable: true,
  },
  technical: {
    name: "Technical Documentation",
    description: "A summary format for technical documents and specifications.",
    template: `Analyze the technical content and provide a summary with these sections:
    1. Technical Overview
    * System Architecture
    * Key Components
    * Technologies Used

    2. Implementation Details
    * Core Features
    * Technical Requirements
    * Dependencies

    3. Performance & Security
    * Performance Metrics
    * Security Measures
    * Scalability Considerations

    4. Integration & Deployment
    * Integration Points
    * Deployment Process
    * Configuration Requirements

    5. Maintenance & Support
    * Monitoring
    * Troubleshooting
    * Updates & Patches`,
    customizable: true,
  }
};
