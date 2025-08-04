import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  account: string;
  date: string;
  type: 'income' | 'expense';
}

export const TransactionsView = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: "Salario", amount: 3200.00, category: "Salario", account: "Cuenta Corriente", date: "2024-01-15", type: "income" },
    { id: 2, description: "Supermercado Walmart", amount: -85.50, category: "Comida", account: "Tarjeta de Débito", date: "2024-01-15", type: "expense" },
    { id: 3, description: "Netflix", amount: -12.99, category: "Entretenimiento", account: "Tarjeta de Crédito", date: "2024-01-14", type: "expense" },
    { id: 4, description: "Gasolina Shell", amount: -45.00, category: "Transporte", account: "Tarjeta de Débito", date: "2024-01-14", type: "expense" },
    { id: 5, description: "Freelance", amount: 800.00, category: "Trabajo Extra", account: "Cuenta Corriente", date: "2024-01-13", type: "income" },
    { id: 6, description: "Farmacia", amount: -35.75, category: "Salud", account: "Efectivo", date: "2024-01-12", type: "expense" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    account: "",
    date: new Date().toISOString().split('T')[0],
    type: "expense" as 'income' | 'expense'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ["Comida", "Transporte", "Entretenimiento", "Salud", "Servicios", "Salario", "Trabajo Extra"];
  const accounts = ["Cuenta Corriente", "Cuenta de Ahorro", "Tarjeta de Crédito", "Tarjeta de Débito", "Efectivo"];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category || !newTransaction.account) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const amount = newTransaction.type === 'expense' 
      ? -Math.abs(parseFloat(newTransaction.amount))
      : Math.abs(parseFloat(newTransaction.amount));

    const transaction: Transaction = {
      id: Date.now(),
      description: newTransaction.description,
      amount,
      category: newTransaction.category,
      account: newTransaction.account,
      date: newTransaction.date,
      type: newTransaction.type
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      description: "",
      amount: "",
      category: "",
      account: "",
      date: new Date().toISOString().split('T')[0],
      type: "expense"
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Transacción agregada",
      description: "La transacción se ha registrado correctamente"
    });
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transacción eliminada",
      description: "La transacción se ha eliminado correctamente"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transacciones</h1>
          <p className="text-muted-foreground">Gestiona tus ingresos y gastos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Transacción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Transacción</DialogTitle>
              <DialogDescription>
                Registra un nuevo ingreso o gasto
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value: 'income' | 'expense') => 
                    setNewTransaction({...newTransaction, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Ingreso</SelectItem>
                    <SelectItem value="expense">Gasto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Ej: Supermercado, Salario..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newTransaction.category} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="account">Cuenta</Label>
                <Select 
                  value={newTransaction.account} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, account: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTransaction}>
                Guardar Transacción
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.account} • {transaction.date}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                    {transaction.category}
                  </Badge>
                  
                  <div className="text-right">
                    <div className={`font-medium text-lg ${transaction.amount > 0 ? 'text-accent' : 'text-destructive'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron transacciones
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};