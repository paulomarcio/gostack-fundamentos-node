import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionRequest {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: TransactionRequest): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (type === Type.OUTCOME && value > total) {
      throw new Error('You do not have enough balance');
    }

    if (type !== Type.INCOME && type !== Type.OUTCOME) {
      throw new Error('Invalid value for Type parameter');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
