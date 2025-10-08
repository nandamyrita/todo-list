import React, { useState, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Edit3,
  Calendar as CalendarIconSmall,
} from "lucide-react";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  createdAt: Date;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        date: new Date(todo.date),
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage when todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    newTodo.trim()
      ? (setTodos([
          ...todos,
          {
            id: Date.now().toString(),
            text: newTodo.trim(),
            completed: false,
            date: selectedDate,
            createdAt: new Date(),
          },
        ]),
        setNewTodo(""),
        toast.success("Tarefa adicionada com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }))
      : toast.error("ERRO! A tarefa não pode ser vazia.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
  setTodos(todos.filter((todo) => todo.id !== id));
  toast.info("Tarefa removida.", {
    position: "top-right",
    autoClose: 3000,  
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  }); 
    
    
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo ? { ...todo, text: editText.trim() } : todo
        )
      );
      setEditingTodo(null);
      setEditText("");
    }
    toast.info("Edição salva.", {
      position: "top-right",
      autoClose: 3000,    
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  const getFilteredTodos = () => {
    return todos.filter((todo) => isSameDay(todo.date, selectedDate));
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    if (isYesterday(date)) return "Ontem";
    return format(date, "d 'de' MMMM", { locale: ptBR });
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = filteredTodos.filter((todo) => todo.completed).length;
  const totalCount = filteredTodos.length;

  const CalendarComponent = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date: React.SetStateAction<Date>) => {
          if (date) {
            setSelectedDate(date);
            setIsMobileCalendarOpen(false);
          }
        }}
        className="rounded-md border"
        locale={ptBR}
      />
      <div className="space-y-2">
        <h3 className="font-medium">Resumo</h3>
        <div className="space-y-1">
          {[0, 1, 2].map((days) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            const dayTodos = todos.filter((todo) => isSameDay(todo.date, date));
            const completed = dayTodos.filter((todo) => todo.completed).length;

            return (
              <div
                key={days}
                className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-sm">{getDateLabel(date)}</span>
                <Badge variant="secondary" className="text-xs">
                  {completed}/{dayTodos.length}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Desktop Calendar Sidebar */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">To-Do List</h1>
                <p className="text-muted-foreground">
                  {getDateLabel(selectedDate)}
                </p>
              </div>

              {/* Mobile Calendar Button */}
              <div className="lg:hidden">
                <Sheet
                  open={isMobileCalendarOpen}
                  onOpenChange={setIsMobileCalendarOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CalendarIconSmall className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Calendário</SheetTitle>
                      <SheetDescription>
                        Selecione uma data para visualizar e gerenciar suas
                        tarefas
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <CalendarComponent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Progress */}
            {totalCount > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-muted-foreground">
                      {completedCount} de {totalCount} concluídas
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          totalCount > 0
                            ? (completedCount / totalCount) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Todo */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar nova tarefa..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTodo()}
                    className="flex-1"
                  />
                  <Button onClick={addTodo}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Todo List */}
            <Card>
              <CardHeader>
                <CardTitle>Tarefas - {getDateLabel(selectedDate)}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma tarefa para esta data.</p>
                    <p className="text-sm">Adicione uma nova tarefa acima!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTodos.map((todo, index) => (
                      <div key={todo.id}>
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                          />

                          {editingTodo === todo.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && saveEdit()
                                }
                                onBlur={saveEdit}
                                className="flex-1"
                                autoFocus
                              />
                              <Button size="sm" onClick={saveEdit}>
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span
                                className={`flex-1 ${
                                  todo.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {todo.text}
                              </span>

                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => startEditing(todo)}
                                  className="h-8 w-8"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                        {index < filteredTodos.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
              transition={Bounce}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
