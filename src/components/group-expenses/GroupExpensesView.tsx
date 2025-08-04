import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Calculator, Trash2, UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  name: string;
  spent: number;
}

interface GroupExpense {
  id: number;
  name: string;
  totalAmount: number;
  participants: Participant[];
  createdDate: string;
  settlements: Settlement[];
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export const GroupExpensesView = () => {
  const { toast } = useToast();
  const [groupExpenses, setGroupExpenses] = useState<GroupExpense[]>([
    {
      id: 1,
      name: "Cena de Cumpleaños",
      totalAmount: 4800.00,
      participants: [
        { id: 1, name: "Juan", spent: 2400.00 },
        { id: 2, name: "María", spent: 1200.00 },
        { id: 3, name: "Carlos", spent: 800.00 },
        { id: 4, name: "Ana", spent: 400.00 }
      ],
      createdDate: "2024-01-15",
      settlements: [
        { from: "Ana", to: "Juan", amount: 800.00 },
        { from: "Carlos", to: "Juan", amount: 400.00 }
      ]
    },
    {
      id: 2,
      name: "Viaje a Córdoba",
      totalAmount: 12000.00,
      participants: [
        { id: 1, name: "Pedro", spent: 8000.00 },
        { id: 2, name: "Laura", spent: 2000.00 },
        { id: 3, name: "Diego", spent: 2000.00 }
      ],
      createdDate: "2024-01-10",
      settlements: [
        { from: "Laura", to: "Pedro", amount: 2000.00 },
        { from: "Diego", to: "Pedro", amount: 2000.00 }
      ]
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    name: "",
    participants: [{ name: "", spent: "" }]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<GroupExpense | null>(null);

  const calculateSettlements = (participants: Participant[]): Settlement[] => {
    const totalAmount = participants.reduce((sum, p) => sum + p.spent, 0);
    const avgAmount = totalAmount / participants.length;
    
    const balances = participants.map(p => ({
      name: p.name,
      balance: p.spent - avgAmount
    }));

    const settlements: Settlement[] = [];
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debt = Math.abs(debtors[i].balance);
      const credit = creditors[j].balance;
      const amount = Math.min(debt, credit);

      if (amount > 0.01) { // Avoid very small amounts
        settlements.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amount: Math.round(amount * 100) / 100
        });
      }

      debtors[i].balance += amount;
      creditors[j].balance -= amount;

      if (Math.abs(debtors[i].balance) < 0.01) i++;
      if (Math.abs(creditors[j].balance) < 0.01) j++;
    }

    return settlements;
  };

  const addParticipant = () => {
    setNewExpense({
      ...newExpense,
      participants: [...newExpense.participants, { name: "", spent: "" }]
    });
  };

  const removeParticipant = (index: number) => {
    setNewExpense({
      ...newExpense,
      participants: newExpense.participants.filter((_, i) => i !== index)
    });
  };

  const updateParticipant = (index: number, field: 'name' | 'spent', value: string) => {
    const updated = newExpense.participants.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    setNewExpense({ ...newExpense, participants: updated });
  };

  const handleCreateExpense = () => {
    if (!newExpense.name || newExpense.participants.some(p => !p.name || !p.spent)) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const participants: Participant[] = newExpense.participants.map((p, index) => ({
      id: index + 1,
      name: p.name,
      spent: parseFloat(p.spent)
    }));

    const totalAmount = participants.reduce((sum, p) => sum + p.spent, 0);
    const settlements = calculateSettlements(participants);

    const expense: GroupExpense = {
      id: Date.now(),
      name: newExpense.name,
      totalAmount,
      participants,
      createdDate: new Date().toISOString().split('T')[0],
      settlements
    };

    setGroupExpenses([expense, ...groupExpenses]);
    setNewExpense({ name: "", participants: [{ name: "", spent: "" }] });
    setIsDialogOpen(false);

    toast({
      title: "Gasto grupal creado",
      description: "El cálculo de división se ha completado"
    });
  };

  const handleDeleteExpense = (id: number) => {
    setGroupExpenses(groupExpenses.filter(expense => expense.id !== id));
    toast({
      title: "Gasto eliminado",
      description: "El gasto grupal se ha eliminado correctamente"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Divisor de Gastos Grupales</h1>
          <p className="text-muted-foreground">Calcula automáticamente quién le debe a quién</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Gasto Grupal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Gasto Grupal</DialogTitle>
              <DialogDescription>
                Ingresa quién gastó cuánto y te calculamos automáticamente las deudas
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-name">Nombre del Gasto</Label>
                <Input
                  id="expense-name"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  placeholder="Ej: Cena de cumpleaños, Viaje a las montañas..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Participantes y Gastos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addParticipant}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Persona
                  </Button>
                </div>

                {newExpense.participants.map((participant, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`name-${index}`}>Nombre</Label>
                      <Input
                        id={`name-${index}`}
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        placeholder="Nombre de la persona"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`spent-${index}`}>Monto Gastado</Label>
                      <Input
                        id={`spent-${index}`}
                        type="number"
                        step="0.01"
                        value={participant.spent}
                        onChange={(e) => updateParticipant(index, 'spent', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    {newExpense.participants.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeParticipant(index)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium">
                    Total del Gasto: $
                    {newExpense.participants
                      .reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0)
                      .toFixed(2)
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Por persona: $
                    {newExpense.participants.length > 0 
                      ? (newExpense.participants
                          .reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0) / newExpense.participants.length)
                          .toFixed(2)
                      : '0.00'
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateExpense}>
                <Calculator className="h-4 w-4 mr-2" />
                Calcular División
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Group Expenses List */}
      <div className="grid gap-6">
        {groupExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{expense.name}</CardTitle>
                    <CardDescription>
                      {expense.participants.length} participantes • {expense.createdDate}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Total: ${expense.totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Participants */}
                <div>
                  <h4 className="font-medium mb-3">Gastos por Persona</h4>
                  <div className="space-y-2">
                    {expense.participants.map((participant) => (
                      <div key={participant.id} className="flex justify-between items-center p-2 rounded border">
                        <span>{participant.name}</span>
                        <span className="font-medium">
                          ${participant.spent.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settlements */}
                <div>
                  <h4 className="font-medium mb-3">Liquidación de Deudas</h4>
                  <div className="space-y-2">
                    {expense.settlements.length > 0 ? (
                      expense.settlements.map((settlement, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded border bg-accent/5">
                          <span>
                            <span className="font-medium">{settlement.from}</span>
                            <span className="text-muted-foreground"> → </span>
                            <span className="font-medium">{settlement.to}</span>
                          </span>
                          <span className="font-medium text-destructive">
                            ${settlement.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Todos los gastos están equilibrados
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {groupExpenses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay gastos grupales</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primer gasto grupal para dividir cuentas automáticamente
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Crear Primer Gasto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed View Dialog */}
      {selectedExpense && (
        <Dialog open={true} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedExpense.name}</DialogTitle>
              <DialogDescription>
                Detalles del cálculo de división
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Resumen</h4>
                <div className="text-sm text-muted-foreground">
                  Total gastado: ${selectedExpense.totalAmount.toFixed(2)}<br />
                  Por persona: ${(selectedExpense.totalAmount / selectedExpense.participants.length).toFixed(2)}<br />
                  Participantes: {selectedExpense.participants.length}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Quién le debe a quién</h4>
                <div className="space-y-2">
                  {selectedExpense.settlements.map((settlement, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium">
                        {settlement.from} debe pagar ${settlement.amount.toFixed(2)} a {settlement.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSelectedExpense(null)}>
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};