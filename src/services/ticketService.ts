import { SupportTicket, TicketMessage } from '../types';

// Initial pre-populated support tickets for a rich and interactive experience
const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1002',
    userId: 'usr_92817345',
    userEmail: 'user@example.com',
    userFullName: 'کاربر نمونه',
    category: 'ولت و برداشت',
    description: 'درخواست تسویه با ولت با موفقیت ثبت شده ولی هنوز هش شبکه ارسال نشده است. لطفاً بررسی کنید.',
    createdAt: '1405/06/02 ساعت 14:10',
    updatedAt: '1405/06/02 ساعت 14:10',
    status: 'pending',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'کاربر نمونه',
        message: 'سلام، من درخواست تسویه ۲۰۰ دلار به آدرس ولتم زدم ولی هنوز تراکنشی در شبکه ثبت نشده.',
        createdAt: '1405/06/02 ساعت 14:10'
      }
    ]
  },
  {
    id: 'TCK-1001',
    userId: 'usr_48291763',
    userEmail: 'maryam.kia@gmail.com',
    userFullName: 'مریم کیا',
    category: 'شبکه و پورسانت',
    description: 'در لایه دوم من کاربری عضو شده ولی پورسانت معرف من ثبت نشده است.',
    createdAt: '1405/05/28 ساعت 10:30',
    updatedAt: '1405/05/28 ساعت 11:15',
    status: 'read_and_answered',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'مریم کیا',
        message: 'سلام وقت بخیر. کاربر جدید در شبکه من عضو شده ولی در بخش پورسانت‌ها پاداشی برای من نیامده است.',
        createdAt: '1405/05/28 ساعت 10:30'
      },
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'پشتیبان سیستم',
        message: 'سلام خانم کیا. پاداش‌ها به صورت لحظه‌ای محاسبه می‌شوند اما جهت تایید نهایی در ساعت ۲۴:۰۰ پردازش نهایی شبکه صورت می‌گیرد. هم‌اکنون بررسی نمایید.',
        createdAt: '1405/05/28 ساعت 11:15'
      }
    ]
  }
];

class TicketService {
  private storageKey = 'tgex_support_tickets';

  constructor() {
    // Bootstrap initial data if not present
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_TICKETS));
    }
  }

  private getStoredTickets(): SupportTicket[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveTickets(tickets: SupportTicket[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tickets));
    // Trigger window events to sync UI in real-time
    window.dispatchEvent(new Event('tgex_database_updated'));
    window.dispatchEvent(new Event('tgex_support_tickets_updated'));
  }

  getAllTickets(): SupportTicket[] {
    return this.getStoredTickets();
  }

  getUserTickets(userId: string): SupportTicket[] {
    return this.getStoredTickets().filter(t => t.userId === userId);
  }

  getTicketById(ticketId: string): SupportTicket | undefined {
    return this.getStoredTickets().find(t => t.id === ticketId);
  }

  createTicket(
    userId: string,
    userEmail: string,
    userFullName: string,
    category: string,
    description: string,
    imageUrl?: string
  ): SupportTicket {
    const tickets = this.getStoredTickets();
    const now = new Date();
    const persianDate = this.getPersianDateTimeString(now);

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userEmail,
      userFullName,
      category,
      description,
      imageUrl,
      createdAt: persianDate,
      updatedAt: persianDate,
      status: 'pending',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: userFullName,
          message: description,
          createdAt: persianDate
        }
      ]
    };

    tickets.push(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  addMessage(ticketId: string, sender: 'user' | 'admin', senderName: string, message: string): boolean {
    const tickets = this.getStoredTickets();
    const ticketIdx = tickets.findIndex(t => t.id === ticketId);
    if (ticketIdx === -1) return false;

    const now = new Date();
    const persianDate = this.getPersianDateTimeString(now);

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      senderName,
      message,
      createdAt: persianDate
    };

    tickets[ticketIdx].messages.push(newMessage);
    tickets[ticketIdx].updatedAt = persianDate;
    
    // Auto status state transitions per requirements:
    if (sender === 'admin') {
      // "after each chat it form admin it make pending chat as readed and aswer"
      tickets[ticketIdx].status = 'read_and_answered';
    } else {
      tickets[ticketIdx].status = 'pending';
    }

    this.saveTickets(tickets);
    return true;
  }

  endTicket(ticketId: string): boolean {
    const tickets = this.getStoredTickets();
    const ticketIdx = tickets.findIndex(t => t.id === ticketId);
    if (ticketIdx === -1) return false;

    tickets[ticketIdx].status = 'ended';
    tickets[ticketIdx].updatedAt = this.getPersianDateTimeString(new Date());
    
    this.saveTickets(tickets);
    return true;
  }

  rateTicket(ticketId: string, ratingPoints: number): boolean {
    const tickets = this.getStoredTickets();
    const ticketIdx = tickets.findIndex(t => t.id === ticketId);
    if (ticketIdx === -1) return false;

    tickets[ticketIdx].ratingPoints = ratingPoints;
    this.saveTickets(tickets);
    return true;
  }

  private getPersianDateTimeString(date: Date): string {
    const optionDate = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const optionTime = { hour: '2-digit', minute: '2-digit' } as const;
    
    try {
      const pDate = new Intl.DateTimeFormat('fa-IR', optionDate).format(date);
      const pTime = new Intl.DateTimeFormat('fa-IR', optionTime).format(date);
      return `${pDate} ساعت ${pTime}`;
    } catch {
      return date.toLocaleString();
    }
  }
}

export const ticketService = new TicketService();
