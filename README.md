Contract Platform

This project is a frontend Contract Management Platform built using React, TypeScript, and Vite.

The application allows users to create contract templates (called blueprints), generate contracts from those templates, and manage each contract through a defined lifecycle such as approval, sending, signing, and final locking.

---

 Project Overview

The main idea behind this project is to simplify how contracts are created and managed.

Instead of writing a new contract from scratch every time, users can first define a blueprint that contains the structure and fields of a contract. Using this blueprint, multiple contracts can be created and tracked.

Each contract follows a clear lifecycle so that its current state is always known.

---

 Objective of the Project

The objectives of this project are:

- To design a structured frontend for managing contracts
- To demonstrate reusable and modular React components
- To implement a real-world workflow using a contract lifecycle
- To use TypeScript for better code clarity and safety
- To create a scalable base that can be extended with backend integration

---

 Technologies Used

The project is built using the following technologies:

- React for building the user interface
- TypeScript for type-safe development
- Vite as the build tool and development server
- CSS for styling
- ESLint for maintaining code quality

---

 Project Structure

The repository follows a clean and organized structure:
contract-platform/
├── public/
│ └── index.html
│
├── src/
│ ├── components/
│ │ ├── common/
│ │ └── blueprint/
│ ├── pages/
│ ├── assets/
│ ├── App.tsx
│ └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
---

How the Application Works

Contract Blueprints

Blueprints define the structure of a contract. They include the fields and layout that every contract created from them will follow.

Contract Creation

Using a blueprint, users can create individual contracts without redefining the structure every time.

Contract Lifecycle

Each contract moves through a predefined sequence of states:

Created → Approved → Sent → Signed → Locked or Revoked

This lifecycle reflects how contracts are handled in real-world systems and ensures clarity about the current status of each contract.

