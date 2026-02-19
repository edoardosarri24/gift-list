# Agent Instructions and Operational Guidelines
This file contains specific instructions for the agent working on the `gift-list` project. Strict adherence to these rules is required.

## 1. Workflow & Interaction
### User Consultation & Approval (CRITICAL)
* **Step 0:** Before writing any documentation or code, you **MUST** discuss your plan and the underlying idea with the user.
* **Approval:** You generally should not proceed to implementation or writing documentation until the user has explicitly approved the proposed idea or design.
### The "No-Go" Rule (Code Implementation)
* **Strict Blocking:** If the user asks for code implementation for a feature or logic not yet documented in the `documentation/**` directory, you **MUST** refuse to proceed with the code.
* **The Counter-Proposal:** Instead of simply refusing, you must:
    1.  Explain that the project follows a **"Documentation First"** policy.
    2.  Propose a **preliminary draft/outline** of the documentation concepts (logic, architecture, goals) directly in the chat.
    3.  Ask the user for permission to proceed with the formal writing of the documentation based on that draft.
* **Iterative Design:** This draft phase is designed to let the user add, modify, or reject ideas before any official documentation (`.tex` files) or code is written.
### Documentation First
* **Sequence:** Implementation (coding) is strictly forbidden until the corresponding concepts are documented in the `documentation/**` directory.
* **Level of Detail:** Documentation at this stage does not need to specify implementation details (like exact class names). It must focus on the **concept**, **logic**, and **architectural idea**.
* **Goal:** Ensure clarity of purpose before writing code.

## 2. Coding Standards
### Language
* **English Only:** All code (variable names, function names, class names, file names, etc.) must be written in **English**.
* **Reasoning:** This is to minimize technical debt and ensure consistency across the codebase.
### Commenting
* **Semantic Meaning:** Comments should focus on the *semantic meaning* of the code.
* **Why, not Just What:** Explain *why* a block of code exists or what business logic it achieves, rather than simply translating syntax into words.

## 3. Hints
* **Context Awareness:** Always check `documentation/**` to understand the current architectural state before proposing changes.
* **LaTeX Handling:** When working with documentation (LaTeX), ensure valid syntax and respect the existing project structure (`main.tex`, `src/`, etc.).
* **Proactive Clarification:** If a requirement is vague, ask for clarification during the "User Consultation" phase rather than guessing.

## 4. Cross-Cutting Concerns
In both documentation and coding, you must consider and plan for the following:
### Security
* **Design:** Proactively design with security in mind (data protection, auth, input validation).
* **Implementation:** Follow industry best practices (e.g., OWASP Top 10).
### Logging
* **Debuggability:** Implement structured logging to facilitate effective debugging and auditing.
### Deployment
* **Process:** The architecture should support a simple, automated, and repeatable deployment process.
* **Environment Configuration:** Keep configuration separate from code.