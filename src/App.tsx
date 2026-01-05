import { useState, useEffect, useCallback } from 'react';

// Types
import type { 
  AppStep, 
  Contact, 
  ColumnMapping, 
  StoredData 
} from './types';
import { 
  STORAGE_KEY, 
  DEFAULT_TEMPLATE, 
  INITIAL_MAPPING 
} from './types';

// Hooks
import { useContacts, useFileUpload } from './hooks';

// Utils
import { processRawDataToContacts, exportContactsToExcel, isExportedFile, processExportedFile, generateAutoMapping, tryAutoMapHeaders } from './utils';

// Components
import { UploadPage, MappingPage, DashboardPage } from './components/pages';
import { WhatsAppModal, SettingsModal, ResetConfirmModal } from './components/modals';

function App() {
  // App Step State
  const [step, setStep] = useState<AppStep>('upload');
  
  // Mapping State
  const [mapping, setMapping] = useState<ColumnMapping>(INITIAL_MAPPING);
  
  // Template State
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  
  // File Upload Hook
  const { 
    headers, 
    rawData, 
    extractedTemplate,
    isLoading: isUploading, 
    handleFileUpload, 
    clearData: clearFileData,
    hasData: hasRawData 
  } = useFileUpload();
  
  // Contacts Hook
  const {
    contacts,
    setContacts,
    toggleContactStatus,
    filteredContacts,
    stats,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
  } = useContacts();
  
  // Modal States
  const [activeContactForWhatsApp, setActiveContactForWhatsApp] = useState<Contact | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredData = JSON.parse(saved);
        if (parsed.contacts && parsed.contacts.length > 0) {
          setContacts(parsed.contacts);
          setTemplate(parsed.template || DEFAULT_TEMPLATE);
          setStep('dashboard');
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [setContacts]);

  // Save to localStorage when contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      const data: StoredData = { contacts, template };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [contacts, template]);

  // File upload handler - detecta automaticamente arquivos exportados
  const onFileUpload = useCallback(async (file: File) => {
    // Limpa dados anteriores antes de carregar novo arquivo
    setContacts([]);
    setMapping(INITIAL_MAPPING);
    await handleFileUpload(file);
  }, [handleFileUpload, setContacts]);

  // Efeito para processar arquivo após upload - detecta se é arquivo exportado
  useEffect(() => {
    if (headers.length > 0 && rawData.length > 0 && step === 'upload') {
      // Verifica se é um arquivo exportado pelo sistema
      if (isExportedFile(headers)) {
        // Gera mapeamento automático para arquivos exportados
        const autoMapping = generateAutoMapping(headers);
        setMapping(autoMapping);
        
        // Processa automaticamente e vai direto pro dashboard
        const importedContacts = processExportedFile(rawData, headers);
        
        if (importedContacts.length > 0) {
          setContacts(importedContacts);
          
          // Restaura o template se existir, senão usa o padrão
          if (extractedTemplate) {
            setTemplate(extractedTemplate);
          } else {
            setTemplate(DEFAULT_TEMPLATE);
          }
          
          setStep('dashboard');
          
          // Mostra mensagem de sucesso
          const contacted = importedContacts.filter(c => c.contacted).length;
          const pending = importedContacts.length - contacted;
          console.log(`✅ Arquivo de continuação detectado! ${importedContacts.length} contatos carregados (${contacted} finalizados, ${pending} pendentes)${extractedTemplate ? ' | Template restaurado!' : ''}`);
        } else {
          // Se não conseguiu processar, vai pro mapeamento normal
          setTemplate(DEFAULT_TEMPLATE);
          setStep('mapping');
        }
      } else {
        // Arquivo novo - reseta template para o padrão
        setTemplate(DEFAULT_TEMPLATE);
        
        // Tenta fazer auto-mapeamento inteligente baseado nos headers
        const autoMapping = tryAutoMapHeaders(headers);
        setMapping(autoMapping);
        setStep('mapping');
      }
    }
  }, [headers, rawData, step, setContacts, extractedTemplate]);

  // Confirm mapping and process contacts
  const confirmMapping = useCallback(() => {
    if (!mapping.phone1 || !mapping.id) {
      alert("As colunas 'ID' e 'Telefone 1' são obrigatórias.");
      return;
    }

    const processedContacts = processRawDataToContacts(rawData, headers, mapping);
    
    if (processedContacts.length === 0) {
      alert("Nenhum contato válido encontrado. Verifique se as colunas ID e Telefone contêm dados.");
      return;
    }

    setContacts(processedContacts);
    setStep('dashboard');
  }, [mapping, rawData, headers, setContacts]);

  // Edit mapping
  const editMapping = useCallback(() => {
    if (!hasRawData) {
      alert("Não é possível editar o mapeamento pois os dados originais não estão em memória. Por favor, carregue o arquivo novamente.");
      setStep('upload');
      return;
    }
    setStep('mapping');
  }, [hasRawData]);

  // Handle mapping back
  const handleMappingBack = useCallback(() => {
    if (contacts.length > 0) {
      setStep('dashboard');
    } else {
      setStep('upload');
    }
  }, [contacts.length]);

  // Export contacts with template
  const handleExport = useCallback(() => {
    exportContactsToExcel(contacts, template);
  }, [contacts, template]);

  // Reset app
  const performReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContacts([]);
    clearFileData();
    setStep('upload');
    setMapping(INITIAL_MAPPING);
    setShowResetConfirm(false);
  }, [setContacts, clearFileData]);

  // WhatsApp modal handler
  const handleWhatsAppOpen = useCallback((contact: Contact) => {
    setActiveContactForWhatsApp(contact);
  }, []);

  const handleWhatsAppContactMade = useCallback(() => {
    if (activeContactForWhatsApp && !activeContactForWhatsApp.contacted) {
      toggleContactStatus(activeContactForWhatsApp.internalId);
    }
  }, [activeContactForWhatsApp, toggleContactStatus]);

  // Render based on step
  if (step === 'upload') {
    return (
      <UploadPage 
        onFileUpload={onFileUpload} 
        isLoading={isUploading} 
      />
    );
  }

  if (step === 'mapping') {
    return (
      <MappingPage
        headers={headers}
        mapping={mapping}
        onMappingChange={setMapping}
        onConfirm={confirmMapping}
        onBack={handleMappingBack}
        isEditing={contacts.length > 0}
      />
    );
  }

  return (
    <>
      <DashboardPage
        contacts={contacts}
        filteredContacts={filteredContacts}
        stats={stats}
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleStatus={toggleContactStatus}
        onOpenWhatsApp={handleWhatsAppOpen}
        onEditMapping={editMapping}
        onExport={handleExport}
        onOpenSettings={() => setShowSettings(true)}
        onReset={() => setShowResetConfirm(true)}
      />

      {/* Modals */}
      <WhatsAppModal
        isOpen={activeContactForWhatsApp !== null}
        onClose={() => setActiveContactForWhatsApp(null)}
        contact={activeContactForWhatsApp}
        template={template}
        onContactMade={handleWhatsAppContactMade}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        template={template}
        onTemplateChange={setTemplate}
      />

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={performReset}
      />
    </>
  );
}

export default App;
