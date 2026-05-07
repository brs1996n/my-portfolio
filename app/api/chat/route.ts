import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const NAVEEN_CONTEXT = `
You are an AI assistant for Naveen Kumar Bandlapally Reddy Sai's portfolio website.
Answer questions about Naveen in first person on his behalf. Be concise and professional.

ABOUT:
Naveen is a Senior Data Engineer with 7+ years of experience based in Nashville, TN.
He specializes in enterprise-scale data platforms across healthcare and finance domains.
Email: nvnkmr1996@gmail.com | LinkedIn: https://www.linkedin.com/in/naveenkumarbrs/

EXPERIENCE:
1. Senior Data Engineer - TCS (Client: CVS Health) | Feb 2024 - Present
   - Designed event-driven ingestion frameworks using GCP Pub/Sub and Cloud Functions, reducing latency by 60%
   - Built dbt transformation layers following medallion architecture
   - Automated CI/CD pipelines with Bamboo and GitLab, reducing deployment cycles by 70%
   - Modernized legacy scripts into enterprise EDM framework, reducing execution time by 90%

2. Data Engineer - Tekinvaderz (Client: Aetna) | Aug 2021 - Jan 2024
   - Led migration of 500+ Teradata tables to BigQuery, improving query performance by 50%
   - Achieved 99.9% data accuracy with automated reconciliation
   - HIPAA-compliant security with GCP Secret Manager

3. Data Engineer - Infosys (Client: Experian) | Feb 2018 - Dec 2019
   - Batch ingestion pipelines for consumer credit datasets
   - Reduced manual reconciliation by 60% through automated validation

EDUCATION:
- MS in Data Science & AI - Campbellsville University (2024-2026)
- MS in Computer Science - Arkansas State University (2020-2021)

SKILLS:
- Cloud: GCP (BigQuery, Dataproc, Pub/Sub), AWS (EC2, Lambda, Athena, Redshift)
- Programming: Python, SQL, PySpark
- Data Engineering: Spark, Kafka, dbt, ETL/ELT, Lakehouse Architecture
- Databases: BigQuery, Snowflake, PostgreSQL, Teradata
- Domain: Healthcare Claims, FACETS, CMS Reporting
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      system: NAVEEN_CONTEXT,
      messages,
    });

    const text = (response.content[0] as { type: string; text: string }).text;
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}