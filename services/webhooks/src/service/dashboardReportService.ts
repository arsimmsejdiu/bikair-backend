import * as CSV from "csv-string";

import { DashboardReportModel } from "@bikairproject/database";


export const getDashboardReport = async (from: string, to: string, transaction: any) => {
    const transactionMaybe = transaction ? { transaction: transaction } : {};
    return await DashboardReportModel.findOne({
        where: {
            date_from: from,
            date_to: to
        },
        ...transactionMaybe
    });
};

export const getOrCreateDashboardReport = async (from: string, to: string, transaction: any) => {
    const transactionMaybe = transaction ? { transaction: transaction } : {};
    let dashboardReport = await getDashboardReport(from, to, transaction);
    if (typeof dashboardReport === "undefined" || dashboardReport === null) {
        dashboardReport = await DashboardReportModel.create({
            date_from: from,
            date_to: to
        }, transactionMaybe);
    }

    return dashboardReport;
};

export const updateReportUrl = async (reportId: number, url: string, transaction: any) => {
    const transactionMaybe = transaction ? { transaction: transaction } : {};
    await DashboardReportModel.update({
        stripe_report_url: url
    }, {
        where: {
            id: reportId
        },
        ...transactionMaybe
    });
};

export const parseCsv = async (reportId: number, csv: string | null, transaction: any) => {
    const parsedCsv = CSV.parse(csv ?? "");
    if (parsedCsv.length < 2) {
        return "No activity this day.";
    }
    let categoryIndex: number | null = null;
    let netIndex: number | null = null;
    const columnNames = parsedCsv[0];
    for (let i = 0; i < columnNames.length; i++) {
        if (columnNames[i] === "reporting_category") {
            categoryIndex = i;
        }
        if (columnNames[i] === "net") {
            netIndex = i;
        }
    }
    if (categoryIndex === null) {
        return "No category value, can't identify \"total\" entry";
    }
    if (netIndex === null) {
        return "No net value";
    }

    const transactionMaybe = transaction ? { transaction: transaction } : {};
    for (const line of parsedCsv) {
        const category = line[categoryIndex];
        if (category === "total") {
            const netValue = line[netIndex];
            await DashboardReportModel.update({
                net_sales: !netValue ? null: Number(netValue)
            }, {
                where: {
                    id: reportId
                },
                ...transactionMaybe
            });
        }
    }
    return "OK";
};
