import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Tag, ShoppingCart, Car, Heart, Home, Briefcase, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isPredefined: boolean;
}

export const CategoriesView = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    // Predefined categories
    { id: 1, name: "Comida", type: "expense", color: "bg-orange-500", icon: "🍽️", isPredefined: true },
    { id: 2, name: "Transporte", type: "expense", color: "bg-blue-500", icon: "🚗", isPredefined: true },
    { id: 3, name: "Entretenimiento", type: "expense", color: "bg-purple-500", icon: "🎬", isPredefined: true },
    { id: 4, name: "Salud", type: "expense", color: "bg-red-500", icon: "🏥", isPredefined: true },
    { id: 5, name: "Servicios", type: "expense", color: "bg-yellow-500", icon: "🏠", isPredefined: true },
    { id: 6, name: "Salario", type: "income", color: "bg-green-500", icon: "💼", isPredefined: true },
    { id: 7, name: "Trabajo Extra", type: "income", color: "bg-emerald-500", icon: "💰", isPredefined: true },
    // Custom categories
    { id: 8, name: "Café", type: "expense", color: "bg-amber-600", icon: "☕", isPredefined: false },
    { id: 9, name: "Libros", type: "expense", color: "bg-indigo-500", icon: "📚", isPredefined: false },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as 'income' | 'expense',
    color: "bg-gray-500",
    icon: "🏷️"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const colorOptions = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", 
    "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
    "bg-gray-500", "bg-emerald-500", "bg-cyan-500", "bg-amber-600"
  ];

  const iconOptions = ["🏷️", "🍽️", "🚗", "🎬", "🏥", "🏠", "💼", "💰", "☕", "📚", "🛒", "⛽", "💊", "🎵", "🎮", "👕"];

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de la categoría",
        variant: "destructive"
      });
      return;
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      type: newCategory.type,
      color: newCategory.color,
      icon: newCategory.icon,
      isPredefined: false
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", type: "expense", color: "bg-gray-500", icon: "🏷️" });
    setIsDialogOpen(false);
    
    toast({
      title: "Categoría agregada",
      description: "La categoría se ha creado correctamente"
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.map(category => 
      category.id === editingCategory.id ? editingCategory : category
    ));
    setEditingCategory(null);
    
    toast({
      title: "Categoría actualizada",
      description: "Los cambios se han guardado correctamente"
    });
  };

  const handleDeleteCategory = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.isPredefined) {
      toast({
        title: "No se puede eliminar",
        description: "Las categorías predefinidas no se pueden eliminar",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Categoría eliminada",
      description: "La categoría se ha eliminado correctamente"
    });
  };

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg text-white ${category.color} text-xl`}>
              {category.icon}
            </div>
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
                  {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                </Badge>
                {category.isPredefined && (
                  <Badge variant="outline">Predefinida</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditingCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!category.isPredefined && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-muted-foreground">Organiza tus ingresos y gastos por categorías</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Categoría</DialogTitle>
              <DialogDescription>
                Crea una nueva categoría personalizada
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Ej: Viajes, Gimnasio, Freelance..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <select 
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({...newCategory, type: e.target.value as 'income' | 'expense'})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-lg ${color} ${
                        newCategory.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setNewCategory({...newCategory, color})}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Icono</Label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-8 h-8 rounded border text-lg hover:bg-accent ${
                        newCategory.icon === icon ? 'bg-accent' : ''
                      }`}
                      onClick={() => setNewCategory({...newCategory, icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory}>
                Crear Categoría
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Income Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5 text-accent" />
          Categorías de Ingresos ({incomeCategories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5 text-destructive" />
          Categorías de Gastos ({expenseCategories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingCategory && (
        <Dialog open={true} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>
                Modifica los datos de la categoría
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  disabled={editingCategory.isPredefined}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Tipo</Label>
                <select 
                  value={editingCategory.type}
                  onChange={(e) => setEditingCategory({...editingCategory, type: e.target.value as 'income' | 'expense'})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  disabled={editingCategory.isPredefined}
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-lg ${color} ${
                        editingCategory.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setEditingCategory({...editingCategory, color})}
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Icono</Label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-8 h-8 rounded border text-lg hover:bg-accent ${
                        editingCategory.icon === icon ? 'bg-accent' : ''
                      }`}
                      onClick={() => setEditingCategory({...editingCategory, icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditCategory}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};