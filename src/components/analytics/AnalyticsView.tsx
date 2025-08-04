import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown, PieChart, BarChart3, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AnalyticsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");

  // Mock data for charts
  const expensesByCategory = [
    { category: "Comida", amount: 850.50, percentage: 39.6, color: "bg-orange-500" },
    { category: "Transporte", amount: 450.00, percentage: 20.9, color: "bg-blue-500" },
    { category: "Entretenimiento", amount: 320.75, percentage: 14.9, color: "bg-purple-500" },
    { category: "Servicios", amount: 280.00, percentage: 13.0, color: "bg-yellow-500" },
    { category: "Salud", amount: 245.25, percentage: 11.4, color: "bg-red-500" },
  ];

  const monthlyTrend = [
    { month: "Oct", income: 3200, expenses: 2100 },
    { month: "Nov", income: 3400, expenses: 2300 },
    { month: "Dic", income: 3800, expenses: 2650 },
    { month: "Ene", income: 3200, expenses: 2146 },
  ];

  const accountBalances = [
    { account: "Cuenta Corriente", balance: 8750.50, percentage: 55.5 },
    { account: "Cuenta de Ahorro", balance: 15200.30, percentage: 96.5 },
    { account: "Tarjeta de Crédito", balance: -1250.75, percentage: -7.9 },
    { account: "Efectivo", balance: 350.00, percentage: 2.2 },
  ];

  const totalIncome = 3200.00;
  const totalExpenses = 2146.50;
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100);

  const periods = [
    { value: "thisWeek", label: "Esta Semana" },
    { value: "thisMonth", label: "Este Mes" },
    { value: "lastMonth", label: "Mes Anterior" },
    { value: "thisYear", label: "Este Año" },
    { value: "custom", label: "Período Personalizado" },
  ];

  const categories = ["Todas", "Comida", "Transporte", "Entretenimiento", "Servicios", "Salud"];
  const accounts = ["Todas", "Cuenta Corriente", "Cuenta de Ahorro", "Tarjeta de Crédito", "Efectivo"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Análisis</h1>
          <p className="text-muted-foreground">Visualiza tus patrones de gasto y ahorro</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account.toLowerCase()}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Período</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${totalIncome.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Período</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalExpenses.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorro</CardTitle>
            <PieChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${(totalIncome - totalExpenses).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {savingsRate.toFixed(1)}% de tus ingresos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ahorro</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 20%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gastos por Categoría
            </CardTitle>
            <CardDescription>
              Distribución de tus gastos en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByCategory.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${item.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolución Mensual
            </CardTitle>
            <CardDescription>
              Comparación de ingresos vs gastos por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{month.month}</span>
                    <div className="text-right text-sm">
                      <div className="text-accent">+${month.income}</div>
                      <div className="text-destructive">-${month.expenses}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${(month.income / 4000) * 100}%` }}
                      />
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-destructive"
                        style={{ width: `${(month.expenses / 4000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribución por Cuentas
          </CardTitle>
          <CardDescription>
            Saldos actuales en tus diferentes cuentas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountBalances.map((account, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{account.account}</span>
                  <Badge variant={account.balance >= 0 ? "default" : "destructive"}>
                    {account.balance >= 0 ? "+" : ""}${account.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${account.balance >= 0 ? 'bg-accent' : 'bg-destructive'}`}
                    style={{ width: `${Math.abs(account.percentage)}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.abs(account.percentage)}% del total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights y Recomendaciones</CardTitle>
          <CardDescription>
            Análisis automático de tus patrones financieros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-accent/5">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-accent">Buen progreso en ahorro</h4>
                  <p className="text-sm text-muted-foreground">
                    Tu tasa de ahorro del {savingsRate.toFixed(1)}% está por encima del promedio. 
                    ¡Mantén este ritmo para alcanzar tus objetivos!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Gastos en comida aumentaron</h4>
                  <p className="text-sm text-yellow-700">
                    Tus gastos en comida representan el 39.6% del total. 
                    Considera planificar comidas para reducir este porcentaje.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <PieChart className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Diversificación saludable</h4>
                  <p className="text-sm text-blue-700">
                    Tienes una buena distribución de gastos entre categorías. 
                    Esto indica un presupuesto equilibrado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};