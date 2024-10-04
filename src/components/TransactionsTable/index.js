import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import './styles.css';
import searchImg from "../../assets/search.svg";

function TransactionsTable({ transactions }) {
    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");

    const columns = [
        {
            title: <span className="table-title">Name</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <span className="table-title">Type</span>,
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: <span className="table-title">Amount</span>,
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: <span className="table-title">Date</span>,
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: <span className="table-title">Tag</span>,
            dataIndex: 'tag',
            key: 'tag',
        },
    ];

    let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
    );

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    return (
        <div style={{ width: "100%", padding: "0rem 1rem", boxSizing: "border-box" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className="input-flex">
                    <img src={searchImg} width="16" alt="search-icon" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name"
                    />
                </div>

                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            <div className="my-table" style={{ overflowX: "auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn">
                            Export to CSV
                        </button>
                        <button className="btn btn-blue">
                            Import from CSV
                        </button>
                        <input
                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <Table dataSource={sortedTransactions} columns={columns} />
            </div>
        </div>
    );
}

export default TransactionsTable;
