import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Invitation, type InsertInvitation } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [deleteInvitation, setDeleteInvitation] = useState<Invitation | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const { toast } = useToast();

  const { data: invitations, isLoading } = useQuery<Invitation[]>({
    queryKey: ["/api/invitations"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/invitations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      toast({
        title: "Success",
        description: "Invitation created successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create invitation",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return await apiRequest("PATCH", `/api/invitations/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      toast({
        title: "Success",
        description: "Invitation updated successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invitation",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/invitations/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invitations"] });
      toast({
        title: "Success",
        description: "Invitation deleted successfully",
      });
      setDeleteInvitation(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invitation",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      imageFile: null,
      imagePreview: "",
    });
    setEditingInvitation(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (invitation: Invitation) => {
    setEditingInvitation(invitation);
    setFormData({
      title: invitation.title,
      description: invitation.description,
      price: invitation.price.toString(),
      imageFile: null,
      imagePreview: invitation.imageUrl,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    if (editingInvitation) {
      updateMutation.mutate({
        id: editingInvitation.id,
        data: formDataToSend,
      });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Manage Invitations
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your invitation designs
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-invitation">
          <Plus className="h-4 w-4 mr-2" />
          Add Invitation
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : invitations && invitations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="grid-admin-invitations">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-muted">
                <img
                  src={invitation.imageUrl}
                  alt={invitation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    ${invitation.price}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2" data-testid={`text-admin-title-${invitation.id}`}>
                  {invitation.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {invitation.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(invitation)}
                  data-testid={`button-edit-${invitation.id}`}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteInvitation(invitation)}
                  data-testid={`button-delete-${invitation.id}`}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg" data-testid="section-empty-invitations">
          <p className="text-muted-foreground mb-4">No invitations yet</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Invitation
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-form-title">
              {editingInvitation ? "Edit Invitation" : "Add New Invitation"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                data-testid="input-price"
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={formData.imagePreview}
                onChange={(file, preview) =>
                  setFormData({ ...formData, imageFile: file, imagePreview: preview })
                }
                onRemove={() =>
                  setFormData({ ...formData, imageFile: null, imagePreview: "" })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-invitation"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingInvitation
                  ? "Update Invitation"
                  : "Create Invitation"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteInvitation}
        onOpenChange={(open) => !open && setDeleteInvitation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteInvitation?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteInvitation && deleteMutation.mutate(deleteInvitation.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
