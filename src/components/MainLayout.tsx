import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  CreditCard, 
  Users, 
  Wallet, 
  Settings, 
  LogOut,
  PlusCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { TransactionsView } from "./transactions/TransactionsView";
import { AccountsView } from "./accounts/AccountsView";
import { CategoriesView } from "./categories/CategoriesView";
import { GroupExpensesView } from "./group-expenses/GroupExpensesView";
import { AnalyticsView } from "./analytics/AnalyticsView";

type ViewType = 'dashboard' | 'transactions' | 'accounts' | 'categories' | 'group-expenses' | 'analytics';

interface MainLayoutProps {
  onLogout: () => void;
}

export const MainLayout = ({ onLogout }: MainLayoutProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Mock data
  const totalBalance = 15750.50;
  const monthlyIncome = 3200.00;
  const monthlyExpenses = 2145.75;
  const recentTransactions = [
    { id: 1, description: "Supermercado", amount: -85.50, category: "Comida", date: "2024-01-15" },
    { id: 2, description: "Salario", amount: 3200.00, category: "Salario", date: "2024-01-15" },
    { id: 3, description: "Netflix", amount: -12.99, category: "Entretenimiento", date: "2024-01-14" },
    { id: 4, description: "Gasolina", amount: -45.00, category: "Transporte", date: "2024-01-14" },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transacciones', icon: CreditCard },
    { id: 'accounts', label: 'Cuentas', icon: Wallet },
    { id: 'categories', label: 'Categorías', icon: Settings },
    { id: 'group-expenses', label: 'Gastos Grupales', icon: Users },
    { id: 'analytics', label: 'Análisis', icon: TrendingUp },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'transactions':
        return <TransactionsView />;
      case 'accounts':
        return <AccountsView />;
      case 'categories':
        return <CategoriesView />;
      case 'group-expenses':
        return <GroupExpensesView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ${totalBalance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    ${monthlyIncome.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    ${monthlyExpenses.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transacciones Recientes</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('transactions')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Transacción
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${transaction.amount > 0 ? 'text-accent' : 'text-destructive'}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold">Gestor de Gastos</h1>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentView(item.id as ViewType)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};