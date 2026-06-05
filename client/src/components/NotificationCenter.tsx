import { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(undefined, {
    refetchInterval: 30000,
  });
  const { data: notifications = [] } = trpc.notifications.unread.useQuery(undefined, {
    refetchInterval: 30000,
  });
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.delete.useMutation();
  const utils = trpc.useUtils();

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync({ id });
      utils.notifications.unread.invalidate();
      utils.notifications.unreadCount.invalidate();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      utils.notifications.unread.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationMutation.mutateAsync({ id });
      utils.notifications.unread.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'control_update':
        return 'bg-blue-50 border-l-blue-500';
      case 'assessment_complete':
        return 'bg-green-50 border-l-green-500';
      case 'compliance_alert':
        return 'bg-red-50 border-l-red-500';
      case 'framework_change':
        return 'bg-amber-50 border-l-amber-500';
      default:
        return 'bg-gray-50 border-l-gray-500';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'control_update':
        return 'Control Update';
      case 'assessment_complete':
        return 'Assessment Complete';
      case 'compliance_alert':
        return 'Compliance Alert';
      case 'framework_change':
        return 'Framework Change';
      default:
        return 'General';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 hover:bg-secondary"
      >
        <Bell size={20} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-border bg-card shadow-lg">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck size={14} className="mr-1" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto mb-2 text-muted-foreground opacity-50" size={32} />
                <p className="text-body-sm text-muted-foreground">No unread notifications</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 rounded p-3 ${getNotificationColor(notification.type)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        {notification.message && (
                          <p className="text-body-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        <p className="text-body-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded p-1 hover:bg-black/10"
                          title="Mark as read"
                        >
                          <Check size={14} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="rounded p-1 hover:bg-black/10"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
