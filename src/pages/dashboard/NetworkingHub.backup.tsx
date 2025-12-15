import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, Plus, Search, Send, MessageSquare, Image as ImageIcon,
  File, Video, Mic, Link as LinkIcon, UserPlus, Settings, LogOut, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  description: string;
  logo: string;
  adminId: string;
  members: GroupMember[];
  createdAt: string;
}

interface GroupMember {
  id: string;
  name: string;
  phone?: string;
  joinedAt: string;
}

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'link';
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}

const NetworkingHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: '', description: '', logo: '' });
  const [newMemberData, setNewMemberData] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    console.log('NetworkingHub: Loading groups...');
    const storedGroups = localStorage.getItem('networking_groups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    } else {
      const defaultGroups: Group[] = [
        {
          id: '1',
          name: 'Study Groups',
          description: 'Form study groups for coding challenges, interview prep, and skill building',
          logo: '📚',
          adminId: 'admin',
          members: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'General Discussion',
          description: 'A place for general conversations and introductions',
          logo: '💬',
          adminId: 'admin',
          members: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Technical Q&A',
          description: 'Ask and answer technical questions about programming',
          logo: '⚡',
          adminId: 'admin',
          members: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Career Advice',
          description: 'Share career tips, interview experiences, and professional advice',
          logo: '💼',
          adminId: 'admin',
          members: [],
          createdAt: new Date().toISOString()
        }
      ];
      setGroups(defaultGroups);
      localStorage.setItem('networking_groups', JSON.stringify(defaultGroups));
    }
    setIsLoading(false);
  }, []);

  // Load messages when group changes
  useEffect(() => {
    if (activeGroup) {
      const storedMessages = localStorage.getItem(`messages_${activeGroup.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    }
  }, [activeGroup]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMember = (group: Group) => {
    return group.members.some(m => m.id === user?.uid);
  };

  const isAdmin = (group: Group) => {
    return group.adminId === user?.uid;
  };

  const handleJoinGroup = (group: Group) => {
    if (!user) return;
    
    const newMember: GroupMember = {
      id: user.uid,
      name: user.displayName || user.email || 'User',
      joinedAt: new Date().toISOString()
    };

    const updatedGroups = groups.map(g => 
      g.id === group.id ? { ...g, members: [...g.members, newMember] } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === group.id) || null);
    
    toast({
      title: "Joined Group!",
      description: `You are now a member of ${group.name}`
    });
  };

  const handleLeaveGroup = (group: Group) => {
    if (!user) return;

    const updatedGroups = groups.map(g => 
      g.id === group.id ? { ...g, members: g.members.filter(m => m.id !== user.uid) } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(null);
    setShowGroupDetails(false);
    
    toast({
      title: "Left Group",
      description: `You have left ${group.name}`
    });
  };

  const handleCreateGroup = () => {
    if (!user || !newGroupData.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive"
      });
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupData.name,
      description: newGroupData.description,
      logo: newGroupData.logo || '👥',
      adminId: user.uid,
      members: [{
        id: user.uid,
        name: user.displayName || user.email || 'Admin',
        joinedAt: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setShowCreateGroup(false);
    setNewGroupData({ name: '', description: '', logo: '' });
    
    toast({
      title: "Group Created!",
      description: `${newGroup.name} has been created successfully`
    });
  };

  const handleAddMember = () => {
    if (!activeGroup || !newMemberData.name.trim()) {
      toast({
        title: "Error",
        description: "Member name is required",
        variant: "destructive"
      });
      return;
    }

    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: newMemberData.name,
      phone: newMemberData.phone,
      joinedAt: new Date().toISOString()
    };

    const updatedGroups = groups.map(g => 
      g.id === activeGroup.id ? { ...g, members: [...g.members, newMember] } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
    setShowAddMember(false);
    setNewMemberData({ name: '', phone: '' });
    
    toast({
      title: "Member Added!",
      description: `${newMember.name} has been added to the group`
    });
  };

  const handleSendMessage = (type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'link' = 'text', fileData?: any) => {
    if (!activeGroup || !user) return;
    if (type === 'text' && !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      groupId: activeGroup.id,
      senderId: user.uid,
      senderName: user.displayName || user.email || 'User',
      content: type === 'text' ? newMessage : fileData?.name || 'File',
      type,
      timestamp: new Date().toISOString(),
      fileUrl: fileData?.url,
      fileName: fileData?.name
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${activeGroup.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleSendMessage(type, {
        name: file.name,
        url: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateDescription = (newDesc: string) => {
    if (!activeGroup || !isAdmin(activeGroup)) return;

    const updatedGroups = groups.map(g => 
      g.id === activeGroup.id ? { ...g, description: newDesc } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
    
    toast({
      title: "Description Updated"
    });
  };

  const getGroupLinks = () => {
    return messages.filter(m => m.type === 'link' || m.content.includes('http'));
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] glass-card overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Groups
            </h2>
            <Button size="sm" className="btn-neon" onClick={() => setShowCreateGroup(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-glass"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => isMember(group) && setActiveGroup(group)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50",
                  activeGroup?.id === group.id && "bg-accent border border-primary/30"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                  {group.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{group.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{group.description}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {group.members.length} members
                  </Badge>
                </div>
                {!isMember(group) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinGroup(group);
                    }}
                  >
                    Join
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {activeGroup && isMember(activeGroup) ? (
          <>
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={() => setShowGroupDetails(true)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
                  {activeGroup.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{activeGroup.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeGroup.members.length} members</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowGroupDetails(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                      <Avatar className="w-8 h-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {message.senderName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground text-sm">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="bg-card/50 rounded-lg p-3 border border-border/30">
                          {message.type === 'text' ? (
                            <p className="text-foreground text-sm">{message.content}</p>
                          ) : message.type === 'image' && message.fileUrl ? (
                            <img src={message.fileUrl} alt={message.fileName} className="max-w-xs rounded" />
                          ) : (
                            <div className="flex items-center gap-2">
                              {getMessageIcon(message.type)}
                              <span className="text-sm">{message.fileName || message.content}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => newMessage.trim() && handleSendMessage('link', { name: newMessage, url: newMessage })}>
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <File className="w-4 h-4" />
                </Button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={`Message ${activeGroup.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="input-glass"
                />
                <Button onClick={() => handleSendMessage()} className="btn-neon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a group to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Group Details Dialog */}
      <Dialog open={showGroupDetails} onOpenChange={setShowGroupDetails}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                {activeGroup?.logo}
              </div>
              <div>
                <DialogTitle>{activeGroup?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Created {activeGroup && new Date(activeGroup.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              {isAdmin(activeGroup!) ? (
                <Textarea 
                  defaultValue={activeGroup?.description}
                  onBlur={(e) => handleUpdateDescription(e.target.value)}
                  className="input-glass"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{activeGroup?.description}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{activeGroup?.members.length} Members</h4>
                <Button size="sm" variant="outline" onClick={() => setShowAddMember(true)}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {activeGroup?.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 p-2 rounded bg-card/30">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{member.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.id === activeGroup.adminId && (
                          <Badge variant="secondary" className="text-xs">Admin</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Links ({getGroupLinks().length})</h4>
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {getGroupLinks().map((msg) => (
                    <a 
                      key={msg.id}
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {msg.content}
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {!isAdmin(activeGroup!) && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => activeGroup && handleLeaveGroup(activeGroup)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit Group
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Group name"
              value={newGroupData.name}
              onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
              className="input-glass"
            />
            <Textarea
              placeholder="Description"
              value={newGroupData.description}
              onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
              className="input-glass"
            />
            <Input
              placeholder="Group emoji/logo (e.g., 🎯)"
              value={newGroupData.logo}
              onChange={(e) => setNewGroupData({ ...newGroupData, logo: e.target.value })}
              className="input-glass"
              maxLength={2}
            />
            <Button onClick={handleCreateGroup} className="w-full btn-neon">
              Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Member name"
              value={newMemberData.name}
              onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
              className="input-glass"
            />
            <Input
              placeholder="Phone number (optional)"
              value={newMemberData.phone}
              onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
              className="input-glass"
            />
            <Button onClick={handleAddMember} className="w-full btn-neon">
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkingHub;
