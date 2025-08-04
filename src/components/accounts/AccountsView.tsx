import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Wallet, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
  initialBalance: number;
}

export const AccountsView = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Cuenta Corriente", type: "Bancaria", balance: 8750.50, initialBalance: 5000.00 },
    { id: 2, name: "Cuenta de Ahorro", type: "Bancaria", balance: 15200.30, initialBalance: 15000.00 },
    { id: 3, name: "Tarjeta de Crédito", type: "Crédito", balance: -1250.75, initialBalance: 0 },
    { id: 4, name: "Efectivo", type: "Efectivo", balance: 350.00, initialBalance: 500.00 },
  ]);

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "Bancaria",
    initialBalance: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const accountTypes = ["Bancaria", "Crédito", "Efectivo", "Inversión"];

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "Crédito":
        return <CreditCard className="h-5 w-5" />;
      case "Efectivo":
        return <Banknote className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type === "Crédito") {
      return balance < 0 ? "text-destructive" : "text-accent";
    }
    return balance >= 0 ? "text-accent" : "text-destructive";
  };

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.initialBalance) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const initialBalance = parseFloat(newAccount.initialBalance);
    const account: Account = {
      id: Date.now(),
      name: newAccount.name,
      type: newAccount.type,
      balance: initialBalance,
      initialBalance: initialBalance
    };

    setAccounts([...accounts, account]);
    setNewAccount({ name: "", type: "Bancaria", initialBalance: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Cuenta agregada",
      description: "La cuenta se ha creado correctamente"
    });
  };

  const handleEditAccount = () => {
    if (!editingAccount || !editingAccount.name) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setAccounts(accounts.map(account => 
      account.id === editingAccount.id ? editingAccount : account
    ));
    setEditingAccount(null);
    
    toast({
      title: "Cuenta actualizada",
      description: "Los cambios se han guardado correctamente"
    });
  };

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id));
    toast({
      title: "Cuenta eliminada",
      description: "La cuenta se ha eliminado correctamente"
    });
  };

  const totalBalance = accounts.reduce((total, account) => {
    if (account.type === "Crédito") {
      return total + account.balance; // Deudas se restan del total
    }
    return total + account.balance;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cuentas Bancarias</h1>
          <p className="text-muted-foreground">Gestiona tus cuentas y saldos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Cuenta</DialogTitle>
              <DialogDescription>
                Agrega una nueva cuenta bancaria o método de pago
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la Cuenta</Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="Ej: Cuenta Corriente Banco Nación"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Cuenta</Label>
                <select 
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="initialBalance">Saldo Inicial</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  value={newAccount.initialBalance}
                  onChange={(e) => setNewAccount({...newAccount, initialBalance: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddAccount}>
                Crear Cuenta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ${totalBalance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-muted-foreground">Patrimonio neto total</p>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant="secondary">{account.type}</Badge>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingAccount(account);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Actual</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(account.balance, account.type)}`}>
                    ${Math.abs(account.balance).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    {account.type === "Crédito" && account.balance < 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">(deuda)</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Inicial</p>
                  <p className="text-lg">
                    ${account.initialBalance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Diferencia</p>
                  <p className={`text-lg font-medium ${
                    (account.balance - account.initialBalance) >= 0 ? 'text-accent' : 'text-destructive'
                  }`}>
                    {(account.balance - account.initialBalance) >= 0 ? '+' : ''}
                    ${(account.balance - account.initialBalance).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingAccount && (
        <Dialog open={true} onOpenChange={() => setEditingAccount(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Cuenta</DialogTitle>
              <DialogDescription>
                Modifica los datos de la cuenta
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre de la Cuenta</Label>
                <Input
                  id="edit-name"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount({...editingAccount, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Tipo de Cuenta</Label>
                <select 
                  value={editingAccount.type}
                  onChange={(e) => setEditingAccount({...editingAccount, type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-balance">Saldo Actual</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  step="0.01"
                  value={editingAccount.balance}
                  onChange={(e) => setEditingAccount({...editingAccount, balance: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingAccount(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditAccount}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};