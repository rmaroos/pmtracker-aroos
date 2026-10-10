"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface ExportPdfButtonProps {
  tasks: Task[];
  dateRange: { from: string; to: string };
  rangeName: string;
  metrics: {
    completed: number;
    open: number;
    overdue: number;
    waiting: number;
  };
  projectCounts: { name: string; count: number }[];
}

export function ExportPdfButton({
  tasks,
  dateRange,
  rangeName,
  metrics,
  projectCounts,
}: ExportPdfButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleExportPdf = () => {
    try {
      setGenerating(true);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      // 1. Header Banner
      doc.setFillColor(37, 99, 235); // #2563eb Primary Blue
      doc.roundedRect(margin, 12, pageWidth - margin * 2, 22, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("PERSONAL PM TRACKER", margin + 6, 21);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text("Completed Work & Progress Report", margin + 6, 28);

      // Report Period on right side of banner
      const rangeText = `${formatDate(dateRange.from, "d MMM yyyy")} – ${formatDate(dateRange.to, "d MMM yyyy")}`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(rangeText, pageWidth - margin - 6, 22, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(
        `Period: ${rangeName.replace("-", " ").toUpperCase()}`,
        pageWidth - margin - 6,
        28,
        { align: "right" }
      );

      // 2. Metrics Summary Section
      let currentY = 40;
      doc.setTextColor(23, 43, 77); // Text color
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PERIOD SUMMARY METRICS", margin, currentY);

      currentY += 4;
      const boxWidth = (pageWidth - margin * 2 - 9) / 4;
      const boxHeight = 16;

      const metricBoxes = [
        { label: "Completed in Period", value: metrics.completed.toString(), color: [22, 101, 52] },
        { label: "Currently Open", value: metrics.open.toString(), color: [30, 41, 59] },
        { label: "Overdue Tasks", value: metrics.overdue.toString(), color: [185, 28, 28] },
        { label: "Waiting on Others", value: metrics.waiting.toString(), color: [161, 98, 7] },
      ];

      metricBoxes.forEach((box, i) => {
        const x = margin + i * (boxWidth + 3);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(220, 227, 236);
        doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, "FD");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(box.label, x + 3, currentY + 5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(box.color[0], box.color[1], box.color[2]);
        doc.text(box.value, x + 3, currentY + 12);
      });

      currentY += boxHeight + 8;

      // 3. Project Breakdown (if any)
      if (projectCounts.length > 0) {
        doc.setTextColor(23, 43, 77);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("PROJECT COMPLETIONS", margin, currentY);

        currentY += 2;

        const projectRows = projectCounts.map((p) => [
          p.name,
          p.count.toString(),
          metrics.completed > 0 ? `${Math.round((p.count / metrics.completed) * 100)}%` : "0%",
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [["Project Name", "Completed Tasks", "Share of Completed Work"]],
          body: projectRows,
          theme: "striped",
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
            fontSize: 8.5,
            fontStyle: "bold",
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [30, 41, 59],
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          margin: { left: margin, right: margin },
        });

        // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
        currentY = doc.lastAutoTable.finalY + 8;
      }

      // 4. Completed Tasks Detailed Table
      doc.setTextColor(23, 43, 77);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("COMPLETED WORK DETAILS", margin, currentY);

      currentY += 2;

      const taskRows = tasks.map((t) => [
        t.completed_at ? formatDate(t.completed_at, "d MMM yyyy") : "-",
        t.projects?.client_name ? `${t.projects.client_name} · ${t.projects.name}` : (t.projects?.name || "Unassigned"),
        t.title + (t.notes ? `\nNote: ${t.notes}` : ""),
        t.category || "General",
        t.priority || "Medium",
      ]);

      if (taskRows.length === 0) {
        taskRows.push(["-", "-", "No tasks completed in this reporting period.", "-", "-"]);
      }

      autoTable(doc, {
        startY: currentY,
        head: [["Completed", "Project", "Task / Activity Details", "Category", "Priority"]],
        body: taskRows,
        theme: "striped",
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: 255,
          fontSize: 8.5,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
        },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 34 },
          2: { cellWidth: "auto" },
          3: { cellWidth: 26 },
          4: { cellWidth: 18 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { left: margin, right: margin, bottom: 16 },
        didDrawPage: (data) => {
          // Footer on each page
          const totalPages = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.setFont("helvetica", "normal");
          doc.text(
            `Personal PM Tracker · Generated on ${formatDate(new Date().toISOString(), "d MMM yyyy HH:mm")}`,
            margin,
            doc.internal.pageSize.getHeight() - 8
          );
          doc.text(
            `Page ${data.pageNumber} of ${totalPages}`,
            pageWidth - margin,
            doc.internal.pageSize.getHeight() - 8,
            { align: "right" }
          );
        },
      });

      const safeFileName = `pm-report-${rangeName}-${dateRange.from}-to-${dateRange.to}.pdf`;
      doc.save(safeFileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      type="button"
      className="button secondary"
      onClick={handleExportPdf}
      disabled={generating}
      aria-label="Export report as PDF"
    >
      {generating ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
      <span>{generating ? "Creating PDF..." : "Export PDF"}</span>
    </button>
  );
}
