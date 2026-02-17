import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CreateOrderDocument, type CreateOrderMutation } from '@/generated/graphql';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NewOrderFormProps {
  onOrderCreated?: (order: CreateOrderMutation['createOrder']) => void;
}

const normalizeItem = (item: string): string => item.trim();

export const NewOrderForm = ({ onOrderCreated }: NewOrderFormProps): JSX.Element => {
  const [itemInput, setItemInput] = useState('');
  const [pendingItems, setPendingItems] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createOrder, { loading }] = useMutation(CreateOrderDocument);

  const addPendingItem = (): void => {
    const normalizedItem = normalizeItem(itemInput);

    if (!normalizedItem) {
      return;
    }

    setPendingItems((currentItems) => [...currentItems, normalizedItem]);
    setItemInput('');
    setFeedbackMessage(null);
    setErrorMessage(null);
  };

  const removePendingItem = (indexToRemove: number): void => {
    setPendingItems((currentItems) => currentItems.filter((_item, index) => index !== indexToRemove));
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    addPendingItem();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (pendingItems.length === 0) {
      setErrorMessage('Add at least one item before submitting an order.');
      return;
    }

    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const result = await createOrder({
        variables: {
          input: {
            items: pendingItems
          }
        }
      });

      const createdOrder = result.data?.createOrder;

      if (!createdOrder) {
        setErrorMessage('The order could not be created. Please retry.');
        return;
      }

      onOrderCreated?.(createdOrder);
      setPendingItems([]);
      setItemInput('');
      setFeedbackMessage(`Created order #${createdOrder.id.slice(-6)}.`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('An unexpected error occurred while creating the order.');
    }
  };

  return (
    <Card className="border-slate-300/70 bg-white/95">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>
          Add menu items and submit to send an order to the kitchen in real time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              value={itemInput}
              onChange={(event) => setItemInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="e.g. Burger"
            />
            <Button type="button" variant="secondary" onClick={addPendingItem} className="sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Items in this order</h3>
            {pendingItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items added yet.</p>
            ) : (
              <ul className="space-y-2">
                {pendingItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center justify-between gap-3 rounded-md border p-2">
                    <Badge variant="secondary" className="max-w-[90%] truncate">
                      {item}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePendingItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" disabled={loading || pendingItems.length === 0} className="w-full">
            {loading ? 'Submitting...' : 'Submit Order'}
          </Button>

          {feedbackMessage ? (
            <Alert>
              <AlertTitle>Order created</AlertTitle>
              <AlertDescription>{feedbackMessage}</AlertDescription>
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Order creation failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
};
