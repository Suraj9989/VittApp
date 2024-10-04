import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { toast } from 'react-toastify';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from "moment";
import { auth, db } from '../firebase';
import TransactionsTable from '../components/TransactionsTable';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const[income, setIncome] = useState(0);
  const[expense, setExpense] = useState(0);
  const[totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    if (!user) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      fetchTransactions(); // Refresh transactions after adding
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions])

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal); // Fix: This should be setExpense, not setIsExpenseModalVisible
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setIsLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = querySnapshot.docs.map((doc) => doc.data());
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      toast.success("Transactions Fetched!");
    } catch (e) {
      console.error("Error fetching transactions: ", e);
      toast.error("Couldn't fetch transactions");
    } finally {
      setIsLoading(false);
    }
  }

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Header />

      <>
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />

        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable transactions = {transactions} />
      </>
    </div>
  );
}

export default Dashboard;
